# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

    # allow requests from your React frontend (local and production)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",  # local development
            "https://healytics-frontend-213826089274.us-central1.run.app"  # prod Cloud Run URL
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # register all prediction routes
    for router in (form_router, text_image_router, vision_router):
        app.include_router(router)

    return app


app = create_app()


@app.get("/health", tags=["health"])
async def health_check():
    logger.info("Health check ping")
    return {"status": "ok"}
