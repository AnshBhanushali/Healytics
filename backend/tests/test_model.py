import joblib
import pandas as pd
import pytest

from app.schemas import FormInput, PredictionResponse
from app.model import predict_form, load_model
from app.config import settings

MODEL_PATH = settings.MODEL_PATH

@pytest.fixture(scope="session")
def model():
    return load_model(MODEL_PATH)

def test_model_loaded(model):
    assert model is not None

def test_pipeline_predict_proba_shape(model):
    # created a single-row DataFrame with all required columns
    sample = pd.DataFrame([{
        "Age": 50,
        "Fever": "Yes",
        "Cough": "No",
        "Fatigue": "Yes",
        "Difficulty Breathing": "No",
        "Gender": "Male",
        "Blood Pressure": "High",
        "Cholesterol Level": "Normal"
    }])
    proba = model.predict_proba(sample)
    assert proba.shape == (1, 2)
    # probability for positive class
    p1 = proba[0,1]
    assert 0.0 <= p1 <= 1.0

def test_predict_form_returns_response():
    inp = FormInput(
        age=60,
        systolic_bp=150,
        diastolic_bp=90,
        cholesterol=260,
        family_history=True
    )
    resp = predict_form(inp, MODEL_PATH)
    assert isinstance(resp, PredictionResponse)
    assert resp.mode == "form"
    assert resp.prediction in {"low_risk","medium_risk","high_risk"}
    assert 0.0 <= resp.confidence <= 1.0
    assert isinstance(resp.top_factors, list)
