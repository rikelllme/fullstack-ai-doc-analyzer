#routers/documents.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.document import Document
from app.schemas.documents import DocumentResponse, QuestionRequest, AnswerResponse
from app.services import ocr_service, ai_service

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Formato inválido. Use JPEG ou PNG.")

    try:
        contents = await file.read()
        text = ocr_service.extract_text(contents, file.content_type)
        
        db_doc = Document(file_name=file.filename, text_content=text)
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)
        return db_doc
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no processamento: {str(e)}")

@router.post("/{document_id}/question", response_model=AnswerResponse)
async def ask_document(
    document_id: int,
    request: QuestionRequest,
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento não encontrado.")

    answer = ai_service.ask_question_about_document(
        doc.text_content,
        request.question
    )

    return {"answer": answer}

@router.get("/", response_model=list[DocumentResponse])
def list_docs(db: Session = Depends(get_db)):
    return db.query(Document).all()