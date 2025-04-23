from fastapi import FastAPI
from .config import settings         
from .logging_conf import configure_logging, logger
from .routers.form import router as form_router

def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(
        title="Uni HealthProj API",
        version="0.1.0",
        description="Production-ready FastAPI for health risk prediction",
    )
    app.include_router(form_router)
    return app

app = create_app()

@app.get("/health", tags=["health"])
async def health_check():
    logger.info("Health check ping")
    return {"status": "ok"}
