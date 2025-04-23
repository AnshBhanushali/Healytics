import argparse
import logging
import structlog
import pandas as pd
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, f1_score
from xgboost import XGBClassifier
import joblib

# Configure structured logging
logging.basicConfig(format="%(message)s", level=logging.INFO)
structlog.configure(
    processors=[
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ]
)
logger = structlog.get_logger()

def load_data(path: str):
    df = pd.read_csv(path)
    X = df[[
        "Fever", "Cough", "Fatigue", "Difficulty Breathing",
        "Age", "Gender", "Blood Pressure", "Cholesterol Level"
    ]]
    y = df["Outcome Variable"].map({"Negative": 0, "Positive": 1})
    return train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)

def build_preprocessor():
    num_feats = ["Age"]
    cat_feats = [
        "Fever", "Cough", "Fatigue", "Difficulty Breathing",
        "Gender", "Blood Pressure", "Cholesterol Level"
    ]
    return ColumnTransformer([
        ("num", StandardScaler(), num_feats),
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat_feats),
    ])

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input",  required=True, help="Path to CSV")
    p.add_argument("--output", required=True, help="Path to save model.joblib")
    args = p.parse_args()

    logger.info("Loading data", path=args.input)
    X_train, X_val, y_train, y_val = load_data(args.input)

    preprocessor = build_preprocessor()
    candidates = {
        "logreg": {
            "model": LogisticRegression(random_state=42, max_iter=1000),
            "params": {"clf__C": [0.01,0.1,1,10]}
        },
        "xgb": {
            "model": XGBClassifier(
                use_label_encoder=False, eval_metric="logloss", random_state=42
            ),
            "params": {
                "clf__n_estimators": [50,100,200],
                "clf__max_depth": [3,5,7],
            }
        },
    }

    best_score, best_name, best_pipe = 0, None, None

    for name, spec in candidates.items():
        logger.info("Training candidate", name=name)
        pipe = Pipeline([
            ("prep", preprocessor),
            ("clf",  spec["model"]),
        ])
        search = RandomizedSearchCV(
            pipe,
            spec["params"],
            n_iter=5,
            cv=3,
            scoring="roc_auc",
            n_jobs=-1,
            random_state=42,
        )
        search.fit(X_train, y_train)
        preds = search.predict_proba(X_val)[:,1]
        auc = roc_auc_score(y_val, preds)
        f1 = f1_score(y_val, search.predict(X_val))
        logger.info(
            "Eval metrics",
            name=name,
            best_params=search.best_params_,
            auc=auc,
            f1=f1
        )
        if auc > best_score:
            best_score, best_name, best_pipe = auc, name, search.best_estimator_

    logger.info("Best model selected", best=best_name, auc=best_score)
    joblib.dump(best_pipe, args.output)
    logger.info("Saved pipeline", path=args.output)

if __name__ == "__main__":
    main()
