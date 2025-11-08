from pydantic import BaseModel

class Earthquake(BaseModel):
    title: str
    mag: float
    place: str      
    time: str
    coordinates: str