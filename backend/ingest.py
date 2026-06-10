"""
Reads cv.md, splits into sections by ## headings, embeds each section with
all-MiniLM-L6-v2, and persists to a local ChromaDB collection.

Run once (or re-run to refresh after editing cv.md):
    python backend/ingest.py

Pass --query "some text" to test retrieval without touching the API:
    python backend/ingest.py --query "Python backend engineer with FastAPI experience"
"""

import argparse
import re
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer

COLLECTION_NAME = "cv_chunks"
CV_PATH = Path(__file__).parent / "data" / "cv.md"
CHROMA_PATH = Path(__file__).parent / "chroma_db"


def load_chunks(cv_path: Path) -> list[dict]:
    text = cv_path.read_text(encoding="utf-8")

    # Split on ## headings, keeping the heading as part of each chunk
    parts = re.split(r"(?=^## )", text, flags=re.MULTILINE)

    chunks = []
    for part in parts:
        part = part.strip()
        if not part:
            continue
        heading_match = re.match(r"^## (.+)", part)
        section_id = heading_match.group(1).strip() if heading_match else "header"
        chunks.append({"id": section_id, "text": part})

    return chunks


def build_collection(chunks: list[dict], model: SentenceTransformer) -> chromadb.Collection:
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))

    # Drop and recreate so re-runs are idempotent
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    collection = client.create_collection(COLLECTION_NAME)

    texts = [c["text"] for c in chunks]
    ids = [c["id"] for c in chunks]
    embeddings = model.encode(texts, show_progress_bar=True).tolist()

    collection.add(documents=texts, embeddings=embeddings, ids=ids)
    return collection


def query_collection(collection: chromadb.Collection, model: SentenceTransformer, query: str, n: int = 3):
    embedding = model.encode([query]).tolist()
    results = collection.query(query_embeddings=embedding, n_results=n)
    return results["documents"][0]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", type=str, default=None, help="Test retrieval with this query string")
    args = parser.parse_args()

    print("Loading model...")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    print(f"Reading CV from {CV_PATH}")
    chunks = load_chunks(CV_PATH)
    print(f"Found {len(chunks)} sections:")
    for c in chunks:
        print(f"  - {c['id']}")

    print("\nEmbedding and persisting to ChromaDB...")
    collection = build_collection(chunks, model)
    print(f"Done. {collection.count()} chunks stored at {CHROMA_PATH}")

    if args.query:
        print(f"\nQuery: '{args.query}'")
        print("Top 3 retrieved sections:\n")
        results = query_collection(collection, model, args.query)
        for i, doc in enumerate(results, 1):
            preview = doc[:300].replace("\n", " ")
            print(f"[{i}] {preview}...\n")


if __name__ == "__main__":
    main()
