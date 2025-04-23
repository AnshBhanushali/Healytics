# app/routers/vision.py

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.model import predict_vision
from app.schemas import PredictionResponse
from app.logging_conf import logger

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post(
    "/vision",
    response_model=PredictionResponse,
    summary="Predict health risk from symptom photo"
)
async def vision_endpoint(file: UploadFile = File(...)):
    logger.info("Received vision file", filename=file.filename)
    try:
        contents = await file.read()
        resp = predict_vision(contents)
        logger.info("Vision prediction", result=resp.dict())
        return resp
    except Exception as e:
        logger.error("Vision error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Vision prediction failed"
        )
