from fastapi import APIRouter, Query, Path
from typing import Optional
from app.models.schemas import GraphData, GraphNode
from app.services.knowledge_graph import get_knowledge_graph, get_node_by_id

router = APIRouter()

@router.get("", response_model=GraphData)
def get_graph(
    type: Optional[str] = Query(None, description="Filter nodes by type (e.g., 'paper', 'station', 'region')"),
    id: Optional[str] = Query(None, description="Center the graph on a specific node ID and return 1st-degree connections")
):
    """
    Retrieve the Polar Knowledge Graph.
    Can be filtered by node type or centered around a specific node ID.
    """
    return get_knowledge_graph(entity_id=id, entity_type=type)

@router.get("/{entity_id}", response_model=GraphNode)
def get_node(
    entity_id: str = Path(..., description="The ID of the node to retrieve")
):
    """
    Retrieve a specific knowledge node by its ID.
    """
    node = get_node_by_id(entity_id)
    if not node:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Node not found")
    return node
