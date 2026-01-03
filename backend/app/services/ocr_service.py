#services/ocr_service.py
import io
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes

def extract_text(file_contents: bytes, content_type: str) -> str:
    text = ""

    if content_type == "application/pdf":
        images = convert_from_bytes(file_contents)
        for img in images:
            text += pytesseract.image_to_string(img)
    else:
        image = Image.open(io.BytesIO(file_contents))
        text = pytesseract.image_to_string(image)

    return text.strip() or "[Nenhum texto detectado]"
