import os
from os import getenv
import platform
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

class Settings:
    PROJECT_NAME: str = "API de Análise de Documentos"
    GROQ_API_KEY = getenv("GROQ_API_KEY")
    TESSERACT_PATH = getenv("TESSERACT_PATH")
    
    # Configuração do LLM
    llm = ChatOpenAI(
        model="llama-3.3-70b-versatile",
        openai_api_key=GROQ_API_KEY,
        openai_api_base="https://api.groq.com/openai/v1",
        temperature=0.2
    )

settings = Settings()

# Configuração Tesseract
if settings.TESSERACT_PATH:
    import pytesseract
    pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_PATH
elif platform.system() == "Windows":
    import pytesseract
    default_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    if os.path.exists(default_path):
        pytesseract.pytesseract.tesseract_cmd = default_path