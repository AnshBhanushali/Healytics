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

async def text_image_endpoint(file: UploadFile = File(...)):
    """
    Accepts an uploaded image of a doctor’s note/prescription,
    runs OCR+NLP, and returns a PredictionResponse.
    """
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