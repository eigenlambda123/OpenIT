from typing import Optional, List, Union
from sqlmodel import SQLModel, Field


class Earthquake(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    mag: float
    place: str      
    time: int
    latitude: float
    longitude: float
     
class Evacuation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name : str
    type: str
    description: str
    latitude: float
    longitude: float

class UserLocation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    latitude: float
    longitude: float