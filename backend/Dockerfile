# backend/Dockerfile

# A small, up-to-date Python base
FROM python:3.10-slim
RUN apt-get update && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 && rm -rf /var/lib/apt/lists/*

# Where our code will live
WORKDIR /app

# Copy the top-level requirements.txt (build context is your repo root)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Bring in your FastAPI app code and the trained model
COPY . .
# (If your model.joblib ended up at backend/app/model.joblib, you don’t need an extra COPY)

# Expose the port
EXPOSE 8000

# Run the server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
