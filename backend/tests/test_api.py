import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}

def test_predict_form_endpoint():
    payload = {
        "age": 45,
        "systolic_bp": 130,
        "diastolic_bp": 85,
        "cholesterol": 220,
        "family_history": False
    }
    r = client.post("/predict/form", json=payload)
    assert r.status_code == 200

    data = r.json()
    # schema assertions
    assert data["mode"] == "form"
    assert data["prediction"] in {"low_risk","medium_risk","high_risk"}
    assert isinstance(data["confidence"], float)
    assert isinstance(data["top_factors"], list)
