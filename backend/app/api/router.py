from fastapi import APIRouter
from app.api.endpoints import search, map, graph, entities

api_router = APIRouter()

api_router.include_router(search.router, tags=["search"])
api_router.include_router(map.router, prefix="/map", tags=["map"])
api_router.include_router(graph.router, prefix="/knowledge-graph", tags=["knowledge-graph"])
api_router.include_router(entities.router, prefix="/entities", tags=["entities"])
