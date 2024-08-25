from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    sync_database_url: str
    redis_url: str
    celery_broker_url: str
    celery_result_backend: str
    secret_key: str
    openai_api_key: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
