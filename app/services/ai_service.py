from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings

def ask_question_about_document(context: str, question: str) -> str:
    template = """
    Você é um assistente administrativo. Responda à pergunta baseando-se APENAS no contexto abaixo.
    
    CONTEXTO DO DOCUMENTO:
    {context}
    
    PERGUNTA:
    {question}
    """
    prompt = PromptTemplate.from_template(template)
    chain = prompt | settings.llm | StrOutputParser()
    
    return chain.invoke({"context": context, "question": question})