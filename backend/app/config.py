from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str

    jwt_secret_key: str = Field(min_length=32)
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 30

    refresh_cookie_name: str = "refresh_token"
    refresh_cookie_path: str = "/api/auth"
    # В production (HTTPS) должно быть true.
    refresh_cookie_secure: bool = False

    # Пароль демо-пользователя, нужен только для python -m app.seed.
    seed_user_password: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
