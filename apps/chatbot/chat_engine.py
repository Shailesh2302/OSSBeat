import os
import uuid
from dotenv import load_dotenv
from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue

load_dotenv()

COLLECTION_NAME = "ossbeat_codebase"
EMBEDDING_DIM = 1024  # nv-embed-v1 dimension

SYSTEM_PROMPT = """You are OSSBeat Assistant, a helpful AI guide for the OSSBeat platform.
OSSBeat is an Open Source Repository Discovery Platform that helps developers find suitable GitHub repositories.

KEY PLATFORM FEATURES:
- **Repository Discovery**: Browse/filter repos by language, stars, forks, topics with infinite scroll
- **GSoC Discovery**: Find Google Summer of Code tagged repositories
- **Hacktoberfest Discovery**: Find Hacktoberfest tagged repositories
- **Open Issues Browser**: Browse open issues from repos with 500+ stars
- **User Profiles**: GitHub contribution graphs, repo stats, privacy controls
- **Authentication**: GitHub OAuth with secure JWT tokens
- **Newsletter**: Subscribe for updates
- **Contact Form**: Reach out to the team

TECH STACK:
- Frontend: Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui
- Backend: Express.js 5 (TypeScript), Prisma 7 ORM, PostgreSQL (Neon.tech)
- Authentication: GitHub OAuth via Arctic, JWT (access + refresh tokens)
- Caching: Redis
- GitHub API: GraphQL v4 + REST v3 via GitHub App

When answering:
1. Be concise and helpful — think "newspaper assistant" style
2. If asked about features, explain how to use them
3. If the user wants repo recommendations, ask about their interests (languages, topics, etc.)
4. Cite relevant source files when referencing codebase info
5. If you don't know something, say so honestly
6. Keep the newspaper/print aesthetic tone — sharp, elegant, informative
7. You can suggest repos from the OSSBeat API — ask the user what they're looking for"""


class ChatEngine:
    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=os.getenv("NVIDIA_API_KEY"),
            base_url=os.getenv("NVIDIA_BASE_URL"),
        )
        qdrant_host = os.getenv("QDRANT_HOST", "")
        qdrant_port = os.getenv("QDRANT_PORT", "6333")
        qdrant_api_key = os.getenv("QDRANT_API_KEY", "")
        if qdrant_host and ("cloud.qdrant.io" in qdrant_host):
            self.qdrant = AsyncQdrantClient(
                url=f"https://{qdrant_host}:{qdrant_port}",
                api_key=qdrant_api_key,
                check_compatibility=False,
            )
        else:
            self.qdrant = AsyncQdrantClient(
                host=qdrant_host,
                port=int(qdrant_port),
                api_key=qdrant_api_key,
                https=True,
                check_compatibility=False,
            )
        self._ingested_count = 0
        self._vector_store_ready = False

    @property
    def ingested_count(self) -> int:
        return self._ingested_count

    @property
    def vector_store_ready(self) -> bool:
        return self._vector_store_ready

    async def _ensure_collection(self):
        try:
            collections = await self.qdrant.get_collections()
            names = [c.name for c in collections.collections]
            if COLLECTION_NAME not in names:
                await self.qdrant.create_collection(
                    collection_name=COLLECTION_NAME,
                    vectors_config=VectorParams(size=EMBEDDING_DIM, distance=Distance.COSINE),
                )
        except Exception:
            pass

    async def _embed(self, text: str) -> list[float]:
        resp = await self.client.embeddings.create(
            model=os.getenv("NVIDIA_EMBEDDING_MODEL", "nvidia/nv-embed-v1"),
            input=text,
            encoding_format="float",
        )
        return resp.data[0].embedding

    async def _retrieve(self, query: str, top_k: int = 5) -> list[tuple[str, str, float]]:
        if not self._vector_store_ready:
            return []
        try:
            query_vec = await self._embed(query)
            hits = await self.qdrant.search(
                collection_name=COLLECTION_NAME,
                query_vector=query_vec,
                limit=top_k,
                score_threshold=0.3,
            )
            results = []
            for hit in hits:
                payload = hit.payload or {}
                source = payload.get("source", "unknown")
                content = payload.get("content", "")
                results.append((source, content, hit.score))
            return results
        except Exception:
            return []

    async def _fetch_ossbeat_repos(self, query_text: str) -> list[str]:
        import httpx

        try:
            api_url = os.getenv("OSSBEAT_API_URL", "http://localhost:4000")
            async with httpx.AsyncClient() as client:
                resp = await client.get(f"{api_url}/repo/discover", timeout=5)
                if resp.status_code == 200:
                    data = resp.json()
                    repos = data.get("repos", [])[:5]
                    lines = []
                    for r in repos:
                        name = r.get("full_name", "")
                        desc = r.get("description", "") or ""
                        lang = r.get("primary_language", "") or ""
                        stars = r.get("stars_count", 0)
                        topics = ", ".join(r.get("topics", [])[:3])
                        lines.append(f"- {name} ({lang}) ★{stars} — {desc}" + (f" topics: {topics}" if topics else ""))
                    return lines
        except Exception:
            pass
        return []

    async def answer(self, message: str, conversation_id: str | None = None) -> dict:
        conv_id = conversation_id or uuid.uuid4().hex[:12]

        context_chunks = await self._retrieve(message)
        repo_context = await self._fetch_ossbeat_repos(message)

        context_block = ""
        if context_chunks:
            parts = []
            for source, content, score in context_chunks:
                snippet = content[:400].strip()
                parts.append(f"[{source}]: {snippet}")
            context_block = "\n\nRelevant codebase context:\n" + "\n---\n".join(parts)

        repo_block = ""
        if repo_context:
            repo_block = "\n\nTop repos on OSSBeat right now:\n" + "\n".join(repo_context)

        sources = list(set(s for s, _, _ in context_chunks))

        user_prompt = f"""User question: {message}{context_block}{repo_block}

Answer the user's question based on OSSBeat platform knowledge and the context above. Be sharp, concise, and newspaper-style."""

        resp = await self.client.chat.completions.create(
            model=os.getenv("NVIDIA_CHAT_MODEL", "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning"),
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=1024,
        )

        reply = resp.choices[0].message.content or "I'm not sure how to answer that. Could you rephrase?"

        return {
            "reply": reply,
            "sources": sources,
            "conversation_id": conv_id,
        }
