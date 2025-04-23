from pydantic import BaseModel, Field
from typing import List, Literal

class FormInput(BaseModel):
    age: int = Field(..., ge=0, le=120)
    systolic_bp: float = Field(..., ge=50, le=250)
    diastolic_bp: float = Field(..., ge=30, le=150)
    cholesterol: float = Field(..., ge=50, le=400)
    family_history: bool


class PredictionResponse(BaseModel):
    mode: Literal["form", "text-image", "vision"]
    prediction: Literal["low_risk", "medium_risk", "high_risk"]
    confidence: float = Field(..., ge=0.0, le=1.0)
    top_factors: List[str]
    description: str
    recommended_actions: List[str]
    urgency: Literal["low", "medium", "high"]
    hospital_readmission: bool
    readmission_probability: float
