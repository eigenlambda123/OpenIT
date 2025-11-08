from pydantic import BaseModel
from typing import Optional, List, Union

class Earthquake(BaseModel):
    title: str
    mag: float
    place: str      
    time: int
    coordinates: List[Union[float, int]]