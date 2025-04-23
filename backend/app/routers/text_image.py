from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.model import predict_text_image
from app.schemas import PredictionResponse
from app.logging_conf import logger

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post(
    "/text-image",
    response_model=PredictionResponse,
    summary="Predict health risk from prescription/report image"
)
async def text_image_endpoint(file: UploadFile = File(...)):
    logger.info("Received text-image file", filename=file.filename)
    try:
        contents = await file.read()
        resp = predict_text_image(contents)
        logger.info("Text-image prediction", result=resp.dict())
        return resp
    except Exception as e:
        logger.error("Text-image error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Text-image prediction failed"
        )
