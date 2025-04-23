from fastapi import APIRouter, HTTPException, status
from app.schemas import FormInput, PredictionResponse
from app.model import predict_form
from app.config import settings
from app.logging_conf import logger

router = APIRouter(prefix="/predict", tags=["predict"])

@router.post(
    "/form",
    response_model=PredictionResponse,
    summary="Predict health risk from form",
)
async def form_endpoint(payload: FormInput):
    logger.info("Received form payload", payload=payload.dict())
    try:
        resp = predict_form(payload, settings.MODEL_PATH)
        logger.info("Prediction result", result=resp.dict())
        return resp
    except Exception as e:
        logger.error("Prediction error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prediction failed"
        )