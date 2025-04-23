import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from app.schemas import FormInput, PredictionResponse

_model: Pipeline | None = None

def load_model(path: str) -> Pipeline:
    global _model
    if _model is None:
        _model = joblib.load(path)
    return _model

def predict_form(data: FormInput, model_path: str) -> PredictionResponse:
    model = load_model(model_path)
    df = pd.DataFrame([{
        "Age": data.age,
        "Fever": "Yes" if data.systolic_bp > 130 else "No",
        "Cough": "No",
        "Fatigue":"No",
        "Difficulty Breathing":"No",
        "Gender":"Unknown",
        "Blood Pressure": "High" if data.systolic_bp>140 else "Normal",
        "Cholesterol Level": "High" if data.cholesterol>240 else "Normal"
    }])
    proba = model.predict_proba(df)[0,1]
    pred = "high_risk" if proba >= 0.7 else ("medium_risk" if proba >= 0.4 else "low_risk")
