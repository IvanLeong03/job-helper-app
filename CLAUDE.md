# Job Application Assistant

A personal project to practice RAG (Retrieval-Augmented Generation). 
The app analyses job descriptions against my CV and returns a structured fit report.

## What it does
- User pastes a job description into the UI
- Backend retrieves relevant CV sections using vector similarity (RAG)
- LLM analyses the JD against retrieved chunks and returns:
  - Key requirements extracted from the JD
  - Strengths and weaknesses relative to the role
  - Fit score out of 10 with reasoning
  - Specific CV bullet point rewrite suggestions

## Stack
- **Frontend:** React + TypeScript + Tailwind (Vite)
- **Backend:** Python + FastAPI
- **Embeddings:** HuggingFace `all-MiniLM-L6-v2` (local)
- **Vector store:** ChromaDB (persistent, local)
- **LLM:** Anthropic API

## Project structure (planned)
- `/src` — React frontend
- `/backend` — FastAPI app, RAG logic, LLM calls

## Frontend notes
- Owner is handling most frontend work themselves — avoid rewriting UI unless explicitly asked
- Tailwind for all styling
- No component libraries