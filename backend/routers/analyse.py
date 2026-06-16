import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
from fastapi import APIRouter

from models import AnalyseRequest, AnalysisResponse
from services.analyser import analyse as run_analysis
from services.retriever import retrieve

router = APIRouter()


@router.post("/analyse", response_model=AnalysisResponse)
def analyse(request: AnalyseRequest) -> AnalysisResponse:
    chunks = retrieve(request.job_description)
    return run_analysis(request.job_description, chunks)
