# Healytics Predictive Health Platform

A full-stack application for predicting 30-day hospital readmission risk, built with machine learning models, a FastAPI backend, a Next.js frontend, and deployed on Google Cloud Platform.

---

## 🔍 Project Overview

Healytics combines patient demographic and clinical data to predict readmission risk, visualize results, and provide actionable insights. Key components:

- **ML Models:** Logistic Regression, Random Forest, Gradient Boosting (XGBoost)
- **Metrics:** AUC, F1-Score
- **Backend:** FastAPI + Uvicorn/Gunicorn, serving REST endpoints for form and image-based predictions
- **Frontend:** Next.js (React) with Chart.js for interactive dashboards and drag-and-drop uploads
- **Containerization & Deployment:** Docker, Google Container Registry, Google Cloud Run
- **Data Storage:** GCP Cloud Storage for model artifacts; support for Azure SQL / PostgreSQL as an alternative

---

## 🚀 Features

- **Form Input**: Enter age, blood pressure, cholesterol, and family history to simulate risk.
- **Vision Input**: Drag & drop symptom images; analyze color/texture metrics.
- **Real-time Dashboard**: Donut, line, radar, and pie charts showing risk scores, readmission trends, factors, and recommendations.
- **Configurable:** Environment-driven API endpoints via `NEXT_PUBLIC_API_URL`.
- **Scalable & Serverless:** Auto-scaled containers on Cloud Run with CORS enabled.

---

## 🛠️ Tech Stack

| Layer       | Technology                         |
| ----------- | ---------------------------------- |
| ML          | scikit-learn, XGBoost             |
| Backend     | Python, FastAPI, Uvicorn           |
| Frontend    | Next.js, React, Tailwind CSS       |
| Charts      | Chart.js (`react-chartjs-2`)       |
| Container   | Docker                             |
| CI/CD       | Google Cloud Build                 |
| Deployment  | Google Cloud Run, GCR              |
| Storage     | GCP Cloud Storage (_models_)       |
| OCR/Image   | OpenCV, pytesseract (vision input) |


## 🔧 Local Development

### Prerequisites

- Node.js (v18+) and npm/yarn
- Python (3.10+) with `pip`
- Docker Desktop (for local containers)
- `gcloud` CLI authenticated

### Backend Setup

```bash
# From repository root
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Run locally
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
# create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
# visit localhost:3000
```

---

## 📦 Docker & Cloud Deploy

### Backend

```bash
# Build & push (using Cloud Build)
gcloud builds submit \
  --tag gcr.io/$PROJECT_ID/healytics-backend:v1 backend/

# Deploy to Cloud Run
gcloud run deploy healytics-backend \
  --image gcr.io/$PROJECT_ID/healytics-backend:v1 \
  --platform managed --region us-central1 \
  --allow-unauthenticated
```

### Frontend

```bash
# Build & push
gcloud builds submit \
  --tag gcr.io/$PROJECT_ID/healytics-frontend:v1 frontend/

# Deploy
gcloud run deploy healytics-frontend \
  --image gcr.io/$PROJECT_ID/healytics-frontend:v1 \
  --platform managed --region us-central1 \
  --allow-unauthenticated
```

> Replace `$PROJECT_ID` with your GCP project (e.g., `healytics-run`).

---

## 📄 API Reference

| Endpoint               | Method | Description                              |
|------------------------|--------|------------------------------------------|
| `/predict/form`        | POST   | Predict risk from form data (JSON body)  |
| `/predict/vision`      | POST   | Predict risk from uploaded image         |
| `/sample_pull`         | GET    | Sample join of Patients–Visits–Medications |

### Form Payload Example

```json
{
  "age": 72,
  "systolic_bp": 150,
  "diastolic_bp": 95,
  "cholesterol": 260,
  "family_history": true
}
```

---

## 📈 Visualization Components

- **Form Dashboard**: Donut charts for risk/readmission, factor list, recommendations.
- **Vision Dashboard**: Donut, line, radar, pie charts of image-derived metrics.
- **Interactive Search**: Table join of patients–visits–medications by Patient_ID.
- **Uploader**: Drag & drop CSVs for bulk data ingestion.

---

## 📚 Credits & Acknowledgments

- Built by Ansh Bhanushali
- Inspired by best practices in MLOps, SaaS health platforms, and GCP serverless architecture

---

> _Happy predicting!_

