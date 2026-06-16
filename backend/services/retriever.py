import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
import chromadb
from sentence_transformers import SentenceTransformer

from config import CHROMA_PATH, COLLECTION_NAME

_model: SentenceTransformer | None = None
_collection: chromadb.Collection | None = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def _get_collection() -> chromadb.Collection:
    global _collection
    if _collection is None:
        client = chromadb.PersistentClient(path=CHROMA_PATH)
        _collection = client.get_collection(COLLECTION_NAME)
    return _collection


def retrieve(query: str, n_results: int = 3) -> list[str]:
    model = _get_model()
    collection = _get_collection()
    embedding = model.encode([query]).tolist()
    results = collection.query(query_embeddings=embedding, n_results=n_results)
    return results["documents"][0]
