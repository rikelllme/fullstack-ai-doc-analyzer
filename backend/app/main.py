#app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import documents
from app.core.tesseract import configure_tesseract

# Cria tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Análise de Documentos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

configure_tesseract()

app.include_router(documents.router)

@app.get("/api/", include_in_schema=False)
async def api_root():
    return {
        "message": "API de Análise de Documentos",
        "docs": "/docs",
        "health": "OK"
    }
