from fastapi import HTTPException, APIRouter
from app.schemas.data import Earthquake
import httpx

router = APIRouter(prefix="/data", tags=["data"])

USGS_API_BASE_URL = "https://earthquake.usgs.gov/fdsnws/event/1/"

@router.get("/earthquakes", response_model=Earthquake)
async def get_earthquakes(
    starttime: str = "2025-11-01",
    endtime: str = "2025-11-07",
    minmagnitude: float = 2.5,
    latitude: float = 7.287,
    longitude: float = 126.690,
    maxradiuskm: int = 500, 
):
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{USGS_API_BASE_URL}query",
                params={
                    "format": "geojson",
                    "starttime": starttime,
                    "endtime": endtime,
                    "minmagnitude": minmagnitude,
                    "latitude": latitude,
                    "longitude": longitude,
                    "maxradiuskm": maxradiuskm
                }
            )
            response.raise_for_status() 
            data = response.json()
            print(data)

            all_data = []
            data_count = 0
            while(data_count < 3):
                every_data = {
                "mag" :data['features'][data_count]['properties']['mag'],
                "place" : data['features'][data_count]['properties']['place'],
                "time" : data['features'][data_count]['properties']['time'],
                "title" : data['features'][data_count]['properties']['title'],
                "coordinates" : data['features'][data_count]['geometry']['coordinates']}
                all_data.append(every_data)
                data_count+=1

            return all_data
        
    except httpx.RequestError as exc:
        raise HTTPException(status_code=500, detail=f"USGS API request failed: {exc}")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(status_code=exc.response.status_code, detail=f"USGS API returned an error: {exc.response.text}")
