from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.ingest import build_collection, load_chunks
from backend.services.retriever import _get_model

CV_PATH = Path(__file__).parent.parent / "data" / "cv.md"

router = APIRouter()


class CVUpdateRequest(BaseModel):
    content: str


@router.get("/cv")
def get_cv() -> dict:
    if not CV_PATH.exists():
        raise HTTPException(status_code=404, detail="cv.md not found")
    return {"content": CV_PATH.read_text()}


@router.post("/cv")
def update_cv(request: CVUpdateRequest) -> dict:
    CV_PATH.write_text(request.content)
    chunks = load_chunks(CV_PATH)
    build_collection(chunks, _get_model())
    return {"ok": True}
