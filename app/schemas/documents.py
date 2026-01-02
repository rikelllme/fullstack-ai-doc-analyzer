from pydantic import BaseModel

class DocumentResponse(BaseModel):
    id: int
    file_name: str
    text_content: str
    
    class Config:
        from_attributes = True

class QuestionRequest(BaseModel):
    document_id: int
    question: str

class AnswerResponse(BaseModel):
    answer: str