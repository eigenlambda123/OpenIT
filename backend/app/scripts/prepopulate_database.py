from app.models.data import Evacuation
from sqlmodel import Session, create_engine

lucena_evacuation_data = [
    # Schools
    {
        "name": "Sacred Heart College",
        "type": "school",
        "description": "Large school complex with multiple buildings and open areas",
        "latitude": 13.9373,
        "longitude": 121.6166
    },
    {
        "name": "Manuel S. Enverga University",
        "type": "university",
        "description": "University campus with gymnasium and large grounds",
        "latitude": 13.9411,
        "longitude": 121.6227
    },
    
    # Sports Facilities
    {
        "name": "Quezon Convention Center",
        "type": "sports_complex",
        "description": "Large indoor arena with multiple evacuation spaces",
        "latitude": 13.9385,
        "longitude": 121.6147
    },
    
    # Government Buildings
    {
        "name": "Lucena City Hall",
        "type": "government",
        "description": "Main government center with emergency facilities",
        "latitude": 13.9379,
        "longitude": 121.6169
    },
    
    # Healthcare
    {
        "name": "MMG Hospital Lucena",
        "type": "hospital",
        "description": "Major hospital with emergency facilities",
        "latitude": 13.9333,
        "longitude": 121.6192
    },
    {
        "name": "Quezon Medical Center",
        "type": "hospital",
        "description": "Government hospital with emergency response center",
        "latitude": 13.9397,
        "longitude": 121.6131
    },
    
    # Open Spaces
    {
        "name": "Perez Park",
        "type": "open_space",
        "description": "Central public park with wide open areas",
        "latitude": 13.9375,
        "longitude": 121.6177
    },
    
    # Community Centers
    {
        "name": "Lucena City Gymnasium",
        "type": "community_center",
        "description": "Large covered facility with basic amenities",
        "latitude": 13.9366,
        "longitude": 121.6156
    }
]

def populate_lucena_evacuation_centers(db: Session):
    for data in lucena_evacuation_data:
        evac = Evacuation(**data)
        db.add(evac)
    try:
        db.commit()
        print("Successfully populated Lucena evacuation centers")
    except Exception as e:
        print(f"Error populating data: {e}")
        db.rollback()