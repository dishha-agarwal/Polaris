from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class SearchQuery(BaseModel):
    query: str
    audience: str = "student"
    filters: Optional[Dict[str, Any]] = None

class SourceCitation(BaseModel):
    id: str
    type: str  # paper, dataset, report
    title: str
    url: Optional[str] = None

class KnowledgeCard(BaseModel):
    id: str
    type: str  # image, video, dataset, paper
    title: str
    metadata: Dict[str, str]

class AIResponse(BaseModel):
    query: str
    audience: str
    summary: str
    sources: List[SourceCitation]
    related_knowledge: List[KnowledgeCard]
    confidence: str = "High"

class Station(BaseModel):
    name: str
    coords: List[float]
    type: str
    datasets: int
    expeditions: int

class GraphNode(BaseModel):
    id: str
    label: str
    group: str  # e.g., paper, dataset, expedition, region, station, topic, media
    description: Optional[str] = None
    url: Optional[str] = None

class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class Entity(BaseModel):
    id: str
    type: str
    title: str
    content: str
    metadata: Dict[str, Any]

class EntityDetail(BaseModel):
    entity: Entity
    related: List[Entity]
