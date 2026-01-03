# Document Analysis API

Esta aplicação permite o upload de documentos (PDF, imagens) para extração de texto via OCR e análise inteligente usando IA, com armazenamento em banco de dados vetorial para consultas eficientes.

## Funcionalidades

- Upload de documentos (PDF, PNG, JPG, JPEG)
- Extração de texto via OCR usando Tesseract
- Análise inteligente de documentos com Groq AI
- Armazenamento vetorial com ChromaDB
- Consultas semânticas nos documentos
- Interface web responsiva em React

## Tecnologias Utilizadas

### Backend
- **FastAPI**: Framework web assíncrono para Python
- **SQLAlchemy**: ORM para interação com banco de dados
- **PostgreSQL**: Banco de dados relacional
- **ChromaDB**: Banco de dados vetorial para embeddings
- **Tesseract OCR**: Extração de texto de imagens
- **Groq AI**: Modelo de linguagem para análise de documentos
- **Pydantic**: Validação de dados
- **Alembic**: Migrações de banco de dados

### Frontend
- **React 19**: Biblioteca JavaScript para interfaces
- **Vite**: Ferramenta de build rápida
- **Material-UI**: Componentes de UI
- **Axios**: Cliente HTTP para requisições API
- **TypeScript**: Tipagem estática

### Infraestrutura
- **Docker & Docker Compose**: Containerização e orquestração
- **Python 3.11**: Ambiente de execução backend
- **Node.js 18**: Ambiente de execução frontend

## Pré-requisitos

- Docker e Docker Compose instalados
- Chave da API do Groq (obtenha em https://groq.com)

## Configuração e Execução

1. **Clone o repositório** (se aplicável):
   ```bash
   git clone <url-do-repositorio>
   cd backend-teste
   ```

2. **Configure as variáveis de ambiente**:
   - Copie o arquivo `.env.example` para `.env`
   - Adicione sua chave da API do Groq:
     ```
     GROQ_API_KEY=sua-chave-aqui
     ```
   - Escolha o banco de dados (opcional):
     - **SQLite (padrão)**: Deixe como está para desenvolvimento rápido
     - **PostgreSQL local**: Configure `DATABASE_URL=postgresql://username:password@localhost:5432/database_name`
     - **PostgreSQL Docker**: Usado automaticamente com `docker-compose up`

3. **Execute a aplicação**:
   ```bash
   docker-compose up --build
   ```

4. **Acesse a aplicação**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Documentação API: http://localhost:8000/docs

## Desenvolvimento Local (sem Docker)

### Backend
```bash
cd backend
pip install -r requirements.txt
# Configure DATABASE_URL e GROQ_API_KEY
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Estrutura do Projeto

```
backend-teste/
├── backend/
│   ├── app/
│   │   ├── core/          # Configurações e utilitários
│   │   ├── models/        # Modelos de dados SQLAlchemy
│   │   ├── routers/       # Endpoints da API
│   │   ├── schemas/       # Schemas Pydantic
│   │   ├── services/      # Lógica de negócio
│   │   └── main.py        # Ponto de entrada da aplicação
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Serviços de API
│   │   └── App.jsx        # Componente principal
│   └── package.json
├── docker-compose.yml     # Orquestração dos serviços
├── Dockerfile             # Container do backend
└── README.md
```

## Decisões Técnicas

### Arquitetura
- **Separação de responsabilidades**: Backend (API) e Frontend (UI) em containers separados para melhor isolamento e escalabilidade
- **Microserviços-like**: Cada componente (DB, Backend, Frontend) em seu próprio container
- **API First**: Desenvolvimento centrado na API RESTful com documentação automática via FastAPI

### Backend
- **FastAPI**: Escolhido por sua performance (baseado em Starlette/ASGI), validação automática com Pydantic e documentação integrada
- **PostgreSQL + ChromaDB**: PostgreSQL para metadados relacionais, ChromaDB para busca vetorial eficiente
- **Tesseract OCR**: Biblioteca madura e gratuita para extração de texto de imagens
- **Groq AI**: API rápida e acessível para análise de linguagem natural

### Frontend
- **React + TypeScript**: Para desenvolvimento de interfaces interativas com tipagem forte
- **Vite**: Build tool moderna com HMR (Hot Module Replacement) para desenvolvimento rápido
- **Material-UI**: Biblioteca de componentes consistente e acessível

### Containerização
- **Docker Compose**: Simplifica o setup local com um único comando
- **Multi-stage builds**: Otimização de imagens (não implementado ainda, mas recomendado para produção)

### Segurança
- **CORS configurado**: Permite comunicação segura entre frontend e backend
- **Validação de entrada**: Pydantic schemas garantem dados seguros
- **Variáveis de ambiente**: Chaves sensíveis não versionadas

## Como o Projeto Atende aos Requisitos

### Requisitos Funcionais
- ✅ Upload de documentos múltiplos formatos
- ✅ Extração de texto via OCR
- ✅ Análise inteligente com IA
- ✅ Armazenamento e consulta de documentos
- ✅ Interface web responsiva

### Requisitos Técnicos
- ✅ API RESTful bem documentada
- ✅ Banco de dados relacional + vetorial
- ✅ Containerização completa
- ✅ Código limpo e organizado
- ✅ Configuração via variáveis de ambiente

### Boas Práticas
- ✅ Separação de camadas (routes, services, models)
- ✅ Validação de dados
- ✅ Tratamento de erros
- ✅ Logs e monitoramento básico
- ✅ Estrutura modular e reutilizável

## Próximos Passos

- Implementar autenticação/autorização
- Adicionar testes unitários e de integração
- Configurar CI/CD
- Otimizar performance (cache, paginação)
- Adicionar mais formatos de documento suportados

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

