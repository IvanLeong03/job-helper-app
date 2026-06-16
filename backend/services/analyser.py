import json
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import anthropic

from config import ANTHROPIC_API_KEY
from models import AnalysisResponse, CVRewrite

_client: anthropic.Anthropic | None = None

_SYSTEM_PROMPT = """You are an expert career coach reviewing a candidate's CV against a job description.

Analyse the job description and the provided CV sections, then return a JSON object with exactly these keys:
- "requirements": array of strings — key requirements extracted from the job description
- "strengths": array of strings — areas where the candidate is a strong fit
- "weaknesses": array of strings — gaps or areas where the candidate falls short
- "fit_score": number between 0 and 10 rating overall fit
- "fit_reasoning": string explaining the fit score
- "cv_rewrites": array of objects with "original" (string) and "suggested" (string) keys — specific CV bullet rewrites to better target this role

Return only valid JSON, no markdown fences, no commentary."""


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        if not ANTHROPIC_API_KEY:
            raise RuntimeError("ANTHROPIC_API_KEY is not set in backend/.env")
        _client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    return _client


def analyse(job_description: str, chunks: list[str]) -> AnalysisResponse:
    client = _get_client()
    chunks_text = "\n\n---\n\n".join(chunks)

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=[
            {
                "type": "text",
                "text": _SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            }
        ],
        messages=[
            {
                "role": "user",
                "content": f"Job Description:\n{job_description}\n\nRelevant CV Sections:\n{chunks_text}",
            }
        ],
    )

    raw = message.content[0].text
    data = json.loads(raw)

    return AnalysisResponse(
        requirements=data["requirements"],
        strengths=data["strengths"],
        weaknesses=data["weaknesses"],
        fit_score=data["fit_score"],
        fit_reasoning=data["fit_reasoning"],
        cv_rewrites=[CVRewrite(**r) for r in data["cv_rewrites"]],
    )
