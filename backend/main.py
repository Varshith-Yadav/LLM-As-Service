from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Document
from sentence_transformers import SentenceTransformer
import numpy as np

app = FastAPI()

# CORS setup (make origin strict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Set specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema for /generate
class PromptRequest(BaseModel):
    prompt: str
    model: str = "gemma:2b"  # Default model now gemma:2b

# Load SentenceTransformer embedding model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Route: Generate text using Ollama
@app.post("/generate")
def generate_text(req: PromptRequest):
    data = {
        "model": req.model,  # Now dynamically uses the model from request body
        "prompt": req.prompt,
        "stream": False
    }

    try:
        response = requests.post("http://localhost:11434/api/generate", json=data)
        response.raise_for_status()  # raises exception for 4xx/5xx

        res_json = response.json()
        print("Ollama raw response:", res_json)  # Debug log

        if "response" not in res_json:
            return {
                "error": res_json.get("error", "Missing 'response' in Ollama reply"),
                "full": res_json
            }

        return {"response": res_json["response"]}

    except requests.exceptions.RequestException as req_err:
        return {
            "error": "Request to Ollama failed",
            "details": str(req_err)
        }
    except Exception as parse_err:
        return {
            "error": "Failed to parse Ollama response",
            "details": str(parse_err),
            "text": response.text
        }

# Route: Add a document with vector embedding
@app.post("/add-document")
def add_document(content: str, db: Session = Depends(get_db)):
    embedding = embedding_model.encode(content).tolist()
    document = Document(content=content, embedding=embedding)
    db.add(document)
    db.commit()
    db.refresh(document)
    return {"id": document.id, "message": "Document added successfully"}

# Route: Retrieve documents most similar to a query
@app.post("/retrieve-documents")
def retrieve_documents(query: str, db: Session = Depends(get_db)):
    query_embedding = embedding_model.encode(query)
    documents = db.query(Document).all()

    def cosine_similarity(vec1, vec2):
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

    results = []
    for doc in documents:
        similarity = cosine_similarity(query_embedding, np.array(doc.embedding))
        results.append({
            "id": doc.id,
            "content": doc.content,
            "similarity": similarity
        })

    results = sorted(results, key=lambda x: x["similarity"], reverse=True)
    return {"results": results[:5]}
