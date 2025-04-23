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