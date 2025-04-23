from fastapi import APIRouter, UploadFile, File, HTTPException, status
from .__init__ import router 
from app.model import predict_text_image
from app.logging_conf import logger

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post(
    "/text-image",
    response_model=None, 
    response_model_exclude_none=True
)