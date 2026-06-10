from fastapi import APIRouter

from backend.models import AnalyseRequest, AnalysisResponse
from backend.services.analyser import analyse as run_analysis
from backend.services.retriever import retrieve

router = APIRouter()


@router.post("/analyse", response_model=AnalysisResponse)
def analyse(request: AnalyseRequest) -> AnalysisResponse:
    chunks = retrieve(request.job_description)
    return run_analysis(request.job_description, chunks)
