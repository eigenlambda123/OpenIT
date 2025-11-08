from pydantic import BaseModel
from typing import Optional, List, Union

class EarthquakeSchema(BaseModel):
    title: str
    mag: float
    place: str      
    time: int
    latitude: float
    longitude: float

class UserLocationCreate(BaseModel):
    latitude: float
    longitude: float