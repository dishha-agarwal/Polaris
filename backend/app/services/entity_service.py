import json
import os
from typing import List, Optional
from app.models.schemas import Entity, EntityDetail

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "mock_data.json")

def load_entities() -> List[Entity]:
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r") as f:
        data = json.load(f)
    
    return [Entity(**item) for item in data]

def get_entities_by_type(entity_type: str) -> List[Entity]:
    entities = load_entities()
    if entity_type == "all":
        return entities
    return [e for e in entities if e.type == entity_type]

def get_entity_detail(entity_id: str) -> Optional[EntityDetail]:
    entities = load_entities()
    center_entity = next((e for e in entities if e.id == entity_id), None)
    
    if not center_entity:
        return None
        
    related_entities = []
    
    # Forward relationships (IDs listed in center_entity's related_ids)
    related_ids_str = center_entity.metadata.get("related_ids", "")
    target_ids = [tid.strip() for tid in related_ids_str.split(",") if tid.strip()]
    
    # Find all entities where center_entity is the target or center_entity is the source
    for e in entities:
        if e.id == center_entity.id:
            continue
            
        is_related = False
        
        # Check if e.id is in center_entity's related_ids
        if e.id in target_ids:
            is_related = True
            
        # Check if center_entity.id is in e's related_ids
        e_related_ids_str = e.metadata.get("related_ids", "")
        e_target_ids = [tid.strip() for tid in e_related_ids_str.split(",") if tid.strip()]
        if center_entity.id in e_target_ids:
            is_related = True
            
        if is_related:
            related_entities.append(e)
            
    return EntityDetail(
        entity=center_entity,
        related=related_entities
    )
