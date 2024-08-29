from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DB_NAME: str
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str
    S3_BUCKET_NAME: str
    SECRET_KEY: str
    JWT_ALGORITHM: str
    ALLOWED_ORIGINS : str
    RECOGNITION_API_URL : str
    TEMP_FILE_DIR: str = "/tmp" 
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024 
    MILEAGE_RATE: float = 0.01 
    ADMIN_API_KEY: str
    S3_RECOGNITION_REQUEST_FOLDER: str = "fruit_recognition_requested"
    S3_RECOGNITION_RESULT_FOLDER: str = "fruit_recognition_result"
    COLAB_NOTEBOOK_URL: str
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()