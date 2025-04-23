from fastapi import APIRouter, UploadFile, File, HTTPException, status
from .__init__ import router 
from app.model import predict_text_image
from app.logging_conf import logger