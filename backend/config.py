from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 480
    NFS_MOUNT_PATH: str = "/tmp/evalhub-media"
    FRONTEND_URL: str = "http://localhost:5177"
    MAIL_SERVER: str = "localhost"
    MAIL_PORT: int = 25
    MAIL_FROM: str = "noreply@eval.heygen.com"
    OKTA_DOMAIN: str = ""
    OKTA_CLIENT_ID: str = ""
    OKTA_CLIENT_SECRET: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
