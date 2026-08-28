from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/ai_analyzer"
    
    # Session config
    SESSION_COOKIE_NAME: str = "session_id"
    SESSION_MAX_AGE: int = 86400 * 7 # 7 days
    
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

settings = Settings()
