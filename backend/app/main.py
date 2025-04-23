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

X = df[FEATURE_COLS]
y = df[LABEL_COL].map({"Negative": 0, "Positive": 1})

# Split data for testing and training
X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Preprocessing pipelines
numeric_features = ["Age"]
numeric_transformer = StandardScaler()

categorical_features = [
    "Fever", "Cough", "Fatigue", "Difficulty Breathing",
    "Gender", "Blood Pressure", "Cholesterol Level"
]
categorical_transformer = OneHotEncoder(handle_unknown="ignore")

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features),
    ]
)

# Candidate for model training
models = {
    "logreg": LogisticRegression(max_iter=1000, random_state=42),
    "xgb":    XGBClassifier(use_label_encoder=False, eval_metric="logloss", random_state=42),
}

best_auc = 0
best_name = None
best_pipeline = None

# Train and Evaluate the models
for name, clf in models.items():
    pipe = Pipeline([
        ("prep", preprocessor),
        ("clf", clf),
    ])
    pipe.fit(X_train, y_train)
    preds = pipe.predict_proba(X_val)[:,1]
    auc = roc_auc_score(y_val, preds)
    f1 = f1_score(y_val, pipe.predict(X_val))
    print(f"{name}: AUC={auc:.3f}, F1={f1:.3f}")
    if auc > best_auc:
        best_auc = auc
        best_name = name
        best_pipeline = pipe

print(f"→ Best model: {best_name} with AUC={best_auc:.3f}")

joblib.dump(best_pipeline, "app/model.joblib")
print("Saved pipeline to app/model.joblib")