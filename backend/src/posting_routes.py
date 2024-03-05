import io
import os
import uuid
import imghdr
import logging
import requests
from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter
from PIL import Image, ImageOps
from fastapi import FastAPI, Request, Depends, HTTPException, Response, Cookie, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .dependencies import get_db
from .user_routes import get_sessions

posts_router = APIRouter()

class ImageStorage:

    MAX_FILE_SIZE = 1024*1024*10 # 10Mb max file size
    VALID_FILE_EXTENSIONS = ["jpg", "jpeg", "png"]

    def __init__(self):
        self.storage_root = f'{os.getcwd()}/image_storage'

    async def addFile(self, file:UploadFile, filetype:str):
        assert file.size < self.MAX_FILE_SIZE
        img_id = str(uuid.uuid4())
        with open(f'{self.storage_root}/{img_id}.{filetype}', 'wb') as local_file:
            local_file.write(await file.read())
        return img_id

    def compress_image(image_path, max_size=480):
        with Image.open(image_path) as img:
            img = ImageOps.exif_transpose(img)
            img.thumbnail((max_size,max_size))
            # Convert the PIL image to bytes in the appropriate format
            img_byte_arr = io.BytesIO()
            format = img.format if img.format is not None else 'JPEG'  # Default to JPEG if format cannot be detected
            img.save(img_byte_arr, format=format)
            img_byte_arr.seek(0)  # Go to the start of the BytesIO object

            return img_byte_arr, format

@posts_router.post("/post/create")
async def create_post(session_id:str=Cookie(None), session_storage=Depends(get_sessions),
                         sql_client=Depends(get_db),
                         title: str = Form(...), description: str = Form(...),
                         file: Optional[UploadFile] = File(None)):
    # We need a valid session_id
    if not session_id:
        raise HTTPException(status_code=401, detail="Must be logged in to create a listing")
    # TODO: check that the session_id actually exists in our session storage
    try:
        username = session_storage.getUserFromSession(session_id)
    except:
        raise HTTPException(status_code=401)
    # enfore a max file size
    if file.size > ImageStorage.MAX_FILE_SIZE:
        raise HTTPException(status_code=422, detail="File too big")
    # enforce image file extensions only
    if not file.filename.endswith(tuple(ImageStorage.VALID_FILE_EXTENSIONS)):
        raise HTTPException(status_code=422, detail="Invalid file extension")
    # enfore image MIME types only
    contents = await file.read()
    file_type = imghdr.what(None, h=contents)
    if file_type not in ImageStorage.VALID_FILE_EXTENSIONS:
        raise HTTPException(status_code=422, detail="Invalid image file.")
    # use our vision model to try to make sure the image is a cat
    r = requests.post('http://vision:8003/cat_classify', files={'image': contents})
    if r.status_code != 200:
        raise HTTPException(status_code=500, detail="classification error")
    if not r.json()["is_cat"]:
        raise HTTPException(status_code=418, detail="not a cat")
    # store the file in our storage bucket
    storage = ImageStorage()
    await file.seek(0)
    img_id = await storage.addFile(file, file_type)
    # store the title, description, and a reference to the image in our SQL table
    async with sql_client.cursor() as cur:
        await cur.execute("""
            INSERT INTO posts 
                (poster_username, title, description, image_name)
                    VALUES
                (%s, %s, %s, %s)
            """, (username, title, description, f'{img_id}.{file_type}'))
        
@posts_router.get("/post/random")
async def get_random_post(sql_client=Depends(get_db)):
    async with sql_client.cursor() as cur:
        await cur.execute("SELECT * FROM posts ORDER BY RAND() LIMIT 1")
        random_post_row = await cur.fetchone()
    return random_post_row

@posts_router.get("/post/image/{image_name}")
async def get_image(image_name:str, quality:str=None, rds_client=Depends(get_db)):
    quality_map = {"low": 240, "mid": 480, "high": 720, None: 720}
    # make sure file name requested is referenced in our listings table
    async with rds_client.cursor() as cur:
        await cur.execute("SELECT image_name FROM posts WHERE image_name = %s", (image_name))
        result = await cur.fetchall()
    if len(result) < 1:
        raise HTTPException(status_code=404)
    # get the file from the storage bucket and return it
    resized_image_bytes_io, file_extension = ImageStorage.compress_image(f'{ImageStorage().storage_root}/{image_name}', quality_map.get(quality, "mid"))
    return StreamingResponse(resized_image_bytes_io, media_type=f"image/{file_extension}")

@posts_router.get("/posts/user/{username}")
async def get_user_posts(username:str, sql_client=Depends(get_db)):
    async with sql_client.cursor() as cur:
        await cur.execute("SELECT * from posts WHERE poster_username=%s", (username))
        result = await cur.fetchall()
    return result

@posts_router.get("/post/likes/{post_id}")
async def get_post_likes(post_id:int, sql_client=Depends(get_db)):
    async with sql_client.cursor() as cur:
        await cur.execute("SELECT COUNT(like_id) FROM likes WHERE liked_post_id=%s", (post_id))
        likes_count = await cur.fetchone()
    if not likes_count:
        return 0
    else:
        return likes_count["COUNT(like_id)"]

@posts_router.post("/post/like/{post_id}")
async def like_post(post_id:int,
                    sql_client=Depends(get_db),
                    session_id:str=Cookie(None),
                    session_storage=Depends(get_sessions)):
    # We need a valid session_id
    if not session_id:
        raise HTTPException(status_code=401, detail="Must be logged in to create a listing")
    # TODO: check that the session_id actually exists in our session storage
    try:
        username = session_storage.getUserFromSession(session_id)
    except:
        raise HTTPException(status_code=401)
    async with sql_client.cursor() as cur:
        # Check if the user already liked the post
        await cur.execute("SELECT like_id FROM likes WHERE liked_post_id=%s AND liker_username=%s", (post_id, username))
        existing_like_row = await cur.fetchall()
        # Code 409 should signal that the user already liked the post
        if existing_like_row:
            raise HTTPException(status_code=409, detail="the user already liked this post")
        # If the post hasnt already been liked by this user, add the like record to database
        await cur.execute("""INSERT INTO likes 
                          (liker_username, liked_post_id)
                          VALUES (%s, %s)""", (username, post_id))
        