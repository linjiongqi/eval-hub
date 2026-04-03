from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/evalhub"
    SECRET_KEY: str = "dev-secret-key-change-in-production"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
