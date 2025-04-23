# app/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    MODEL_PATH: str = Field("app/model.joblib", env="MODEL_PATH")
    LOG_LEVEL: str   = Field("INFO",                env="LOG_LEVEL")
    HOST: str        = Field("0.0.0.0",              env="HOST")
    PORT: int        = Field(8000,                   env="PORT")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()
