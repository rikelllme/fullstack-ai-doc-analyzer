from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.database import engine, Base
from app.routers import documents

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

app.include_router(documents.router)

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")