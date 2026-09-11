import json
import os
from typing import List, Optional, Dict, Any
from app.models.schemas import GraphNode, GraphEdge, GraphData

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "mock_data.json")

def load_raw_data() -> List[Dict[str, Any]]:
    if not os.path.exists(DATA_PATH):
        return []
    with open(DATA_PATH, "r") as f:
        return json.load(f)

def build_graph() -> GraphData:
    raw_data = load_raw_data()
    
    nodes_dict = {}
    edges = []
    
    # First pass: create nodes
    for item in raw_data:
        node_id = item["id"]
        
        # Avoid duplicates
        if node_id not in nodes_dict:
            nodes_dict[node_id] = GraphNode(
                id=node_id,
                label=item["title"],
                group=item["type"],
                description=item.get("content", ""),
                url=item.get("metadata", {}).get("url")
            )
            
    # Second pass: create edges based on related_ids
    for item in raw_data:
        source_id = item["id"]
        related_ids_str = item.get("metadata", {}).get("related_ids", "")
        if related_ids_str:
            target_ids = [tid.strip() for tid in related_ids_str.split(",") if tid.strip()]
            for target_id in target_ids:
                if target_id in nodes_dict:
                    edges.append(GraphEdge(
                        source=source_id,
                        target=target_id,
                        relationship="RELATED_TO"
                    ))
                    # Optionally add reverse edge for undirected graph visualization
                    # or keep it directed depending on UI
                    
    return GraphData(
        nodes=list(nodes_dict.values()),
        edges=edges
    )

def get_knowledge_graph(entity_id: Optional[str] = None, entity_type: Optional[str] = None) -> GraphData:
    full_graph = build_graph()
    
    if not entity_id and not entity_type:
        return full_graph
        
    filtered_nodes = {}
    filtered_edges = []
    
    # Filter by entity_type if specified (and no specific entity_id)
    if entity_type and not entity_id:
        target_nodes = [n for n in full_graph.nodes if n.group == entity_type]
        valid_ids = {n.id for n in target_nodes}
        
        for n in target_nodes:
            filtered_nodes[n.id] = n
            
        for e in full_graph.edges:
            if e.source in valid_ids and e.target in valid_ids:
                filtered_edges.append(e)
                
        return GraphData(nodes=list(filtered_nodes.values()), edges=filtered_edges)
        
    # Filter by entity_id (return 1st degree connections)
    if entity_id:
        # Find the center node
        center_node = next((n for n in full_graph.nodes if n.id == entity_id), None)
        if not center_node:
            return GraphData(nodes=[], edges=[])
            
        filtered_nodes[center_node.id] = center_node
        
        for e in full_graph.edges:
            if e.source == entity_id or e.target == entity_id:
                filtered_edges.append(e)
                other_id = e.target if e.source == entity_id else e.source
                other_node = next((n for n in full_graph.nodes if n.id == other_id), None)
                if other_node:
                    filtered_nodes[other_node.id] = other_node
                    
        return GraphData(nodes=list(filtered_nodes.values()), edges=filtered_edges)

    return full_graph

def get_node_by_id(entity_id: str) -> Optional[GraphNode]:
    full_graph = build_graph()
    return next((n for n in full_graph.nodes if n.id == entity_id), None)
