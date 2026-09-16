from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "postgresql+psycopg://manpower:manpower_dev@localhost:5432/manpower"
    cors_origins: str = "http://localhost:3000"
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_jwt_audience: str = "authenticated"
    supabase_jwt_secret: str = ""
    auth_enforced: bool = False
    storage_bucket: str = ""
    storage_endpoint_url: str = ""
    storage_access_key: str = ""
    storage_secret_key: str = ""
    storage_region: str = "auto"
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[4] / ".env", extra="ignore"
    )
    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]

@lru_cache
def get_settings() -> Settings:
    return Settings()
