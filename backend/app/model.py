import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from app.schemas import FormInput, PredictionResponse
from PIL import Image
import pytesseract
import cv2
import numpy as np
import io

_model: Pipeline | None = None

def load_model(path: str) -> Pipeline:
    global _model
    if _model is None:
        _model = joblib.load(path)
    return _model

_model_form: Pipeline | None = None
def load_form_model(path: str) -> Pipeline:
    global _model_form
    if _model_form is None:
        _model_form = joblib.load(path)
    return _model_form

def predict_form(data: FormInput, model_path: str) -> PredictionResponse:
    model = load_form_model(model_path)
    df = pd.DataFrame([{
        "Age": data.age,
        "Fever": "Yes" if data.systolic_bp > 130 else "No",
        "Cough": "No",
        "Fatigue": "No",
        "Difficulty Breathing":"No",
        "Gender":"Unknown",
        "Blood Pressure": "High" if data.systolic_bp>140 else "Normal",
        "Cholesterol Level": "High" if data.cholesterol>240 else "Normal"
    }])
    proba = model.predict_proba(df)[0,1]
    pred = "high_risk" if proba>=0.7 else ("medium_risk" if proba>=0.4 else "low_risk")
    factors = []
    if data.systolic_bp>140: factors.append("high_systolic_bp")
    if data.cholesterol>240: factors.append("high_cholesterol")
    if data.family_history:    factors.append("family_history")
    if not factors: factors = ["age_factor"]
    return PredictionResponse(
        mode="form", prediction=pred, confidence=round(proba,3), top_factors=factors[:2]
    )

def predict_text_image(file_bytes: bytes) -> PredictionResponse:
    # OCR to extract text
    img = Image.open(io.BytesIO(file_bytes))
    text = pytesseract.image_to_string(img)
    # Simple keyword check
    keywords = {"pain","headache","prescription","dose"}
    high_risk = any(kw in text.lower() for kw in keywords)
    pred = "medium_risk" if high_risk else "low_risk"
    confidence = 0.8 if high_risk else 0.5
    factors = ["keyword_match"] if high_risk else ["no_keywords"]
    return PredictionResponse(
        mode="text-image", prediction=pred, confidence=confidence, top_factors=factors
    )