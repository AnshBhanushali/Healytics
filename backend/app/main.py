# app/main.py

from fastapi import FastAPI
from .config import settings
from .logging_conf import configure_logging, logger
from .routers.form       import router as form_router
from .routers.text_image import router as text_image_router
from .routers.vision     import router as vision_router

def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(
        title="Uni HealthProj API",
        version="0.2.0",
        description="Health risk API with form, text-image, and vision"
    )
    for r in (form_router, text_image_router, vision_router):
        app.include_router(r)
    return app

app = create_app()

@app.get("/health", tags=["health"])
async def health_check():
    logger.info("Health check ping")
    return {"status": "ok"}
