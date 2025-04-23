from fastapi import APIRouter, HTTPException, status
from app.schemas import FormInput, PredictionResponse
from app.model import predict_form
from app.config import settings
from app.logging_conf import logger