import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "API de Análise de Documentos"
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    TESSERACT_PATH: str = os.getenv("TESSERACT_PATH")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

settings = Settings()
