import io
import pytesseract
from PIL import Image

def extract_text_from_image(file_contents: bytes) -> str:
    image = Image.open(io.BytesIO(file_contents))
    text = pytesseract.image_to_string(image, lang='eng')
    return text.strip() if text.strip() else "[Nenhum texto detectado]"