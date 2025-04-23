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
        "Difficulty Breathing": "No",
        "Gender": "Unknown",
        "Blood Pressure": "High" if data.systolic_bp > 140 else "Normal",
        "Cholesterol Level": "High" if data.cholesterol > 240 else "Normal"
    }])
    proba = model.predict_proba(df)[0, 1]
    pred = "high_risk" if proba >= 0.7 else ("medium_risk" if proba >= 0.4 else "low_risk")

    factors = []
    if data.systolic_bp > 140:
        factors.append("high_systolic_bp")
    if data.cholesterol > 240:
        factors.append("high_cholesterol")
    if data.family_history:
        factors.append("family_history")
    if not factors:
        factors = ["age_factor"]

    return PredictionResponse(
        mode="form",
        prediction=pred,
        confidence=round(proba, 3),
        top_factors=factors[:2],
        description="Your form-based health analysis is complete.",
        recommended_actions=["Reduce sodium intake", "Exercise regularly"],
        urgency="high" if pred == "high_risk" else ("medium" if pred == "medium_risk" else "low"),
        hospital_readmission=pred == "high_risk",
        readmission_probability=round(proba * 0.9, 3)
    )


def predict_text_image(file_bytes: bytes) -> PredictionResponse:
    img = Image.open(io.BytesIO(file_bytes))
    text = pytesseract.image_to_string(img)
    keywords = {"pain", "headache", "prescription", "dose"}
    high_risk = any(kw in text.lower() for kw in keywords)
    pred = "medium_risk" if high_risk else "low_risk"
    confidence = 0.8 if high_risk else 0.5
    factors = ["keyword_match"] if high_risk else ["no_keywords"]

    return PredictionResponse(
        mode="text-image",
        prediction=pred,
        confidence=confidence,
        top_factors=factors,
        description="Text analysis completed using OCR.",
        recommended_actions=["Follow prescription", "Consult doctor if pain persists"],
        urgency="medium" if high_risk else "low",
        hospital_readmission=False,
        readmission_probability=round(confidence * 0.7, 3)
    )


def predict_vision(file_bytes: bytes) -> PredictionResponse:
    arr = np.frombuffer(file_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    red_mean = img[:, :, 2].mean()
    high_risk = red_mean > 100
    pred = "high_risk" if high_risk else "low_risk"
    confidence = 0.85 if high_risk else 0.4
    factors = ["high_redness"] if high_risk else ["normal_color"]

    return PredictionResponse(
        mode="vision",
        prediction=pred,
        confidence=confidence,
        top_factors=factors,
        description="Vision analysis based on redness intensity.",
        recommended_actions=["Seek emergency care" if high_risk else "No action needed"],
        urgency="high" if high_risk else "low",
        hospital_readmission=high_risk,
        readmission_probability=round(confidence * 0.95, 3)
    )
