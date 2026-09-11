from fastapi import APIRouter, Query
from app.models.schemas import AIResponse
from app.services.rag_service import get_rag_search_response

router = APIRouter()

@router.get("/search", response_model=AIResponse)
def perform_search(
    q: str = Query(..., description="The semantic search query"),
    audience: str = Query("student", description="The target audience for the AI explanation")
):
    """
    Perform a semantic search and return an AI-generated explanation with provenance.
    """
    response = get_rag_search_response(query=q, audience=audience)
    return response
