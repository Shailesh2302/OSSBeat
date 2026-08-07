import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from chat_engine import ChatEngine
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="OSSBeat Chatbot", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chat_engine = ChatEngine()


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = []
    conversation_id: str


class HealthResponse(BaseModel):
    status: str
    ingested_files: int
    vector_store_ready: bool


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        ingested_files=chat_engine.ingested_count,
        vector_store_ready=chat_engine.vector_store_ready,
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        result = await chat_engine.answer(req.message, req.conversation_id)
        return ChatResponse(
            reply=result["reply"],
            sources=result["sources"],
            conversation_id=result["conversation_id"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    port = int(os.getenv("CHATBOT_PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
