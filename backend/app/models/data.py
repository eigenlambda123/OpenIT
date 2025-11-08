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
     