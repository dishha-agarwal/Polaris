from fastapi import APIRouter
from typing import List
from app.models.schemas import Station

router = APIRouter()

@router.get("/stations", response_model=List[Station])
def get_stations():
    """
    Get the list of active polar research stations.
    """
    return [
        {
            "name": "Bharati Station", 
            "coords": [-69.4068, 76.1953], 
            "type": "Active Research Station", 
            "datasets": 86, 
            "expeditions": 24
        },
        {
            "name": "Maitri Station", 
            "coords": [-70.7667, 11.7333], 
            "type": "Active Research Station", 
            "datasets": 142, 
            "expeditions": 40
        },
        {
            "name": "Himadri Station (Arctic)", 
            "coords": [78.9226, 11.9333], 
            "type": "Active Research Station", 
            "datasets": 35, 
            "expeditions": 12
        },
    ]
