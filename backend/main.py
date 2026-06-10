from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.analyse import router as analyse_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyse_router)
