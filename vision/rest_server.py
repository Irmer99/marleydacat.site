import os
import uuid
import torch
import logging
from pydantic import BaseModel

from fastapi import FastAPI, Request, Depends, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image
from io import BytesIO
from cat_classifier import CatClassifier
from transformers import ViTImageProcessor

app = FastAPI()

# CORS
origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://192.168.1.167:3000",
    "http://marleydacat.site",
    "https://marleydacat.site",
    "http://http://146.190.141.184"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Set-Cookie"]
)

# route handlers
@app.get("/")
def root():
    return "Marley says meowww"

import torch
from PIL import Image
from transformers import ViTImageProcessor

vit_processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
cat_logistic_classifier = CatClassifier()
cat_logistic_classifier.load_state_dict(torch.load('cat-classifier-best.pt'))
cat_logistic_classifier.eval()
cat_logistic_classifier.vision_transformer.eval()

@app.post("/cat_classify")
async def cat_classify(image: UploadFile):
    img_bytes = BytesIO(await image.read())
    with torch.no_grad():
        img_feats = vit_processor(images=[Image.open(img_bytes).convert('RGB')], return_tensors="pt")["pixel_values"]
        probability = cat_logistic_classifier.predict(img_feats)
    print(probability)
    prediction = float(probability[0][0])
    print(prediction)
    return {"is_cat": prediction > 0.5}