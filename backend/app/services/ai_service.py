from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.llm import get_llm
from app.services.vector_store import build_vector_store

llm = get_llm()

def ask_question_about_document(context: str, question: str) -> str:
    vector_store = build_vector_store(context)

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )

    relevant_docs = retriever.invoke(question)
    retrieved_text = "\n\n".join([doc.page_content for doc in relevant_docs])

    prompt = PromptTemplate.from_template("""
    Você é um assistente administrativo.
    Responda SOMENTE com base no contexto abaixo.

    CONTEXTO:
    {context}

    PERGUNTA:
    {question}
    """)

    chain = prompt | llm | StrOutputParser()

    return chain.invoke({
        "context": retrieved_text,
        "question": question
    })
