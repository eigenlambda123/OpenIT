from sqlmodel import SQLModel, Field

class Earthquake(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    mag: float
    place: str
    time: str
    coordinates: list = []
    