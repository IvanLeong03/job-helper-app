import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
CHROMA_PATH: str = str(Path(__file__).parent / "chroma_db")
COLLECTION_NAME: str = "cv_chunks"
