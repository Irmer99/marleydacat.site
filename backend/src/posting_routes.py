import os
import uuid
import imghdr
import logging
import requests
from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter
from fastapi import FastAPI, Request, Depends, HTTPException, Response, Cookie, File, UploadFile, Form
from fastapi.responses import FileResponse
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
    # use out vision model to try to make sure the image is a cat
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
async def get_image(image_name:str, rds_client=Depends(get_db)):
    # make sure file name requested is referenced in our listings table
    async with rds_client.cursor() as cur:
        await cur.execute("SELECT image_name FROM posts WHERE image_name = %s", (image_name))
        result = await cur.fetchall()
    if len(result) < 1:
        raise HTTPException(status_code=404)
    # get the file from the storage bucket and return it
    file_extension = image_name.split(".")[-1]
    return FileResponse(f'{ImageStorage().storage_root}/{image_name}', media_type=f"image/{file_extension}")