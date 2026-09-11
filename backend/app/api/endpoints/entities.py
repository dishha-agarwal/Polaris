from fastapi import APIRouter, Query, Path, HTTPException
from typing import List, Optional
from app.models.schemas import Entity, EntityDetail
from app.services.entity_service import get_entities_by_type, get_entity_detail

router = APIRouter()

@router.get("", response_model=List[Entity])
def list_entities(
    type: str = Query("all", description="Filter by entity type (e.g., expedition, dataset, media)")
):
    """
    List raw entities from the knowledge base.
    """
    return get_entities_by_type(type)

@router.get("/{entity_id}", response_model=EntityDetail)
def get_entity(
    entity_id: str = Path(..., description="The ID of the entity to retrieve")
):
    """
    Retrieve a specific entity and its resolved 1st-degree relations.
    """
    detail = get_entity_detail(entity_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Entity not found")
    return detail
