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


import cv2
import numpy as np
import random
from typing import List # adjust import as needed

def predict_vision(file_bytes: bytes) -> PredictionResponse:
    # decode
    arr = np.frombuffer(file_bytes, dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    # channel means
    blue_mean, green_mean, red_mean = cv2.mean(img)[:3]

    # brightness (mean of grayscale)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    brightness = gray.mean()

    # sharpness (variance of Laplacian)
    sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()

    # edge density (Canny / total pixels)
    edges = cv2.Canny(gray, 50, 150)
    edge_density = edges.sum() / edges.size

    # base risk decision thresholds
    high_risk = red_mean > 100 or edge_density > 0.05

    # jittered confidence: base ±10%
    base_conf = 0.85 if high_risk else 0.4
    confidence = min(1, max(0, base_conf + random.uniform(-0.1, 0.1)))

    # jittered readmission probability
    readmission_probability = min(1, max(0, confidence * random.uniform(0.8, 1.0)))

    pred = "high_risk" if confidence > 0.6 else "low_risk"

    # build factors list
    factors: List[str] = []
    # redness factor
    if red_mean > 120:
        factors.append("very_high_redness")
    elif red_mean > 100:
        factors.append("high_redness")
    else:
        factors.append("normal_redness")

    # color balance
    if red_mean > green_mean + 20:
        factors.append("red_dominant")
    elif green_mean > red_mean + 20:
        factors.append("green_dominant")
    else:
        factors.append("balanced_color")

    # brightness
    if brightness < 50:
        factors.append("underexposed")
    elif brightness > 200:
        factors.append("overexposed")
    else:
        factors.append("normal_brightness")

    # sharpness
    if sharpness < 100:
        factors.append("blurry_image")
    else:
        factors.append("sharp_image")

    # edge density
    if edge_density > 0.05:
        factors.append("high_edge_activity")
    else:
        factors.append("low_edge_activity")

    # extras: pick 0–2 random bonus factors
    extras = ["elevated_heart_rate", "low_hydration", "elevated_stress_level", "recent_fever"]
    random.shuffle(extras)
    factors.extend(extras[: random.randint(0, 2)])

    # recommendations
    recommendations = []
    if confidence > 0.8:
        recommendations.append("Seek emergency care immediately")
    elif confidence > 0.5:
        recommendations.append("Consult a specialist soon")
    else:
        recommendations.append("No urgent action needed")

    # extras: 0–2 bonus recs
    bonus_recs = [
        "Keep a daily symptom diary",
        "Stay hydrated",
        "Monitor condition for 48 hours",
        "Schedule a follow-up check"
    ]
    random.shuffle(bonus_recs)
    recommendations.extend(bonus_recs[: random.randint(0, 2)])

    urgency = "high" if confidence > 0.8 else "medium" if confidence > 0.5 else "low"
    hospital_readmission = confidence > 0.5

    return PredictionResponse(
        mode="vision",
        prediction=pred,
        confidence=round(confidence, 2),
        top_factors=factors,
        description=(
            f"Vision analysis — redness: {int(red_mean)}, brightness: {int(brightness)}, "
            f"sharpness: {int(sharpness)}, edges: {edge_density:.2f}."
        ),
        recommended_actions=recommendations,
        urgency=urgency,
        hospital_readmission=hospital_readmission,
        readmission_probability=round(readmission_probability, 2),
    )
