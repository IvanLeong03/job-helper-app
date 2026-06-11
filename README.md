# Job Application Helper Tool with RAG

This tool lets users paste job descriptions and provides feedback based on the fit between the position's requirements and the user's CV

### How it work

**Phase 1: CV ingestion**
- User enters their CV in .md format
- The CV is read and split by section headings
- Chunk embeddings with `all-MiniLM-L6-v2`
- Store chunks in ChromaDB in the backend

**Phase 2: API request**
- User pastes the job description
- Frontend sends a POST request to `/analyse`
- The `analyser.py` in the backend takes the job description, retrieves chunks and calls Claude
- Structured response is received and displayed


### Extensions to consider

This tool can be extended to include features such as 
- Logging each record and whether the user applied
- Storing multiple versions of the users CV and identifying which one to use