#!/usr/bin/env python3
"""Ingest OSSBeat codebase into Qdrant vector store."""

import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct

COLLECTION_NAME = "ossbeat_codebase"
EMBEDDING_DIM = 1024
BATCH_SIZE = 20
MAX_FILE_SIZE = 50_000  # skip files larger than 50KB
MAX_CONTENT_LENGTH = 2000  # truncate content per chunk

# Directories and file patterns to include
INCLUDE_DIRS = [
    "apps/backend/src",
    "apps/web/app",
    "apps/web/components",
    "packages/database/prisma",
]
EXCLUDE_PATTERNS = [
    "node_modules",
    ".turbo",
    "dist",
    ".next",
    ".pnpm",
    "generated",
    "__pycache__",
    ".git",
]

WORKSPACE = Path(__file__).resolve().parent.parent.parent

SYSTEM_KNOWLEDGE = [
    {
        "source": "README.md",
        "content": open(WORKSPACE / "README.md", "r").read()[:MAX_CONTENT_LENGTH],
    },
]


def should_include(filepath: Path) -> bool:
    for excl in EXCLUDE_PATTERNS:
        if excl in filepath.parts:
            return False
    ext = filepath.suffix
    if ext not in {".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".prisma", ".md", ".yaml", ".yml", ".env.example"}:
        return False
    if filepath.stat().st_size > MAX_FILE_SIZE:
        return False
    return True


def chunk_content(content: str, max_len: int = MAX_CONTENT_LENGTH) -> list[str]:
    if len(content) <= max_len:
        return [content]
    chunks = []
    for i in range(0, len(content), max_len):
        chunks.append(content[i : i + max_len])
    return chunks


async def ingest():
    client = AsyncOpenAI(
        api_key=os.getenv("NVIDIA_API_KEY"),
        base_url=os.getenv("NVIDIA_BASE_URL"),
    )
    qdrant_host = os.getenv("QDRANT_HOST", "")
    qdrant_port = os.getenv("QDRANT_PORT", "6333")
    qdrant_api_key = os.getenv("QDRANT_API_KEY", "")
    if qdrant_host and ("cloud.qdrant.io" in qdrant_host):
        qdrant = AsyncQdrantClient(
            url=f"https://{qdrant_host}:{qdrant_port}",
            api_key=qdrant_api_key,
            check_compatibility=False,
        )
    else:
        qdrant = AsyncQdrantClient(
            host=qdrant_host,
            port=int(qdrant_port),
            api_key=qdrant_api_key,
            https=True,
            check_compatibility=False,
        )

    # Ensure collection
    qdrant_ok = True
    try:
        collections = await qdrant.get_collections()
        names = [c.name for c in collections.collections]
        if COLLECTION_NAME in names:
            await qdrant.delete_collection(COLLECTION_NAME)
            print(f"Deleted existing collection '{COLLECTION_NAME}'")

        await qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
        )
        print(f"Created collection '{COLLECTION_NAME}'")
    except Exception as e:
        print(f"⚠️ Qdrant connection failed ({e}). Will still embed files but skip upload.")
        qdrant_ok = False

    # Collect files
    files = []
    for dir_rel in INCLUDE_DIRS:
        dir_abs = WORKSPACE / dir_rel
        if dir_abs.exists():
            for fpath in dir_abs.rglob("*"):
                if fpath.is_file() and should_include(fpath):
                    rel = fpath.relative_to(WORKSPACE)
                    try:
                        content = fpath.read_text(encoding="utf-8", errors="ignore")
                        files.append((str(rel), content))
                    except Exception:
                        pass

    for doc in SYSTEM_KNOWLEDGE:
        files.append((doc["source"], doc["content"]))

    print(f"Found {len(files)} files to ingest")

    # Embed and upload in batches
    all_points = []
    for idx, (rel_path, content) in enumerate(files):
        chunks = chunk_content(content)
        for chunk_idx, chunk in enumerate(chunks):
            point_id = idx * 100 + chunk_idx
            all_points.append(
                PointStruct(
                    id=point_id,
                    vector=[0.0] * EMBEDDING_DIM,  # placeholder
                    payload={
                        "source": str(rel_path),
                        "content": chunk,
                        "file_path": str(rel_path),
                    },
                )
            )

    total = len(all_points)
    print(f"Total chunks to embed: {total}")

    for start in range(0, total, BATCH_SIZE):
        batch = all_points[start : start + BATCH_SIZE]
        texts = [p.payload["content"] for p in batch]

        resp = await client.embeddings.create(
            model=os.getenv("NVIDIA_EMBEDDING_MODEL", "nvidia/nv-embed-v1"),
            input=texts,
            encoding_format="float",
        )
        vectors = [data.embedding for data in resp.data]

        for point, vec in zip(batch, vectors):
            point.vector = vec

        if qdrant_ok:
            await qdrant.upsert(collection_name=COLLECTION_NAME, points=batch)
            print(f"  Uploaded {start + len(batch)}/{total} chunks")

    if qdrant_ok:
        print(f"\n✅ Ingested {total} chunks from {len(files)} files into Qdrant")
    else:
        print(f"\n⚠️ Qdrant unavailable. Run 'python3 ingest.py' again after fixing Qdrant connection.")
    await client.close()
    await qdrant.close()


if __name__ == "__main__":
    asyncio.run(ingest())
