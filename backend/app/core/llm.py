from langchain_openai import ChatOpenAI
from app.core.config import settings

def get_llm():
    return ChatOpenAI(
        model="llama-3.3-70b-versatile",
        openai_api_key=settings.GROQ_API_KEY,
        openai_api_base="https://api.groq.com/openai/v1",
        temperature=0.2
    )
