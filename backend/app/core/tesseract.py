import os
import platform
import pytesseract
from app.core.config import settings

def configure_tesseract():
    if settings.TESSERACT_PATH:
        pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_PATH

    elif platform.system() == "Windows":
        default_path = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        if os.path.exists(default_path):
            pytesseract.pytesseract.tesseract_cmd = default_path
        else:
            raise RuntimeError("Tesseract não encontrado no caminho padrão")

configure_tesseract()
