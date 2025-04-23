import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score, f1_score
import joblib

# Loading data for classification
df = pd.read_csv("Disease_symptom_and_patient_profile_dataset.csv")

# Defining features for classification and prediction
FEATURE_COLS = [
    "Fever", "Cough", "Fatigue", "Difficulty Breathing",
    "Age", "Gender", "Blood Pressure", "Cholesterol Level"
]
LABEL_COL = "Outcome Variable"

