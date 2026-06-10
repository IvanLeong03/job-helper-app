from pydantic import BaseModel


class AnalyseRequest(BaseModel):
    job_description: str


class CVRewrite(BaseModel):
    original: str
    suggested: str


class AnalysisResponse(BaseModel):
    requirements: list[str]
    strengths: list[str]
    weaknesses: list[str]
    fit_score: float
    fit_reasoning: str
    cv_rewrites: list[CVRewrite]
