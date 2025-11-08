from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from app.db.database import get_session
from app.models.data import Earthquake, Evacuation, UserLocation
from app.schemas.data import EarthquakeSchema, UserLocationCreate
import math
import httpx

router = APIRouter(prefix="/data", tags=["data"])

USGS_API_BASE_URL = "https://earthquake.usgs.gov/fdsnws/event/1/"

@router.get("/earthquakes", response_model=List[EarthquakeSchema])
async def get_earthquakes(
    starttime: str = "2025-11-01",
    endtime: str = "2025-11-07",
    minmagnitude: float = 2.5,
    latitude: float = 7.287,
    longitude: float = 126.690,
    maxradiuskm: int = 500,
    db: Session = Depends(get_session)
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

            # Create a list to hold SQLAlchemy model instances
            earthquake_objects = []
            
            # Iterate through the features from the API response
            for feature in data.get("features", [])[:3]: # Limit to first 3 as in original logic
                properties = feature.get("properties", {})
                geometry = feature.get("geometry", {})

                # Check if coordinates exist and is a list/tuple
                coordinates = geometry.get("coordinates", [])
                if isinstance(coordinates, (list, tuple)) and len(coordinates) >= 2:
                    # GeoJSON uses [longitude, latitude] order
                    longitude = coordinates[0]
                    latitude = coordinates[1]
                    
                    # print(f"Latitude: {latitude}, Longitude: {longitude}")
                else:
                    # Handle cases where coordinates might be missing or invalid
                    print("Invalid or missing coordinates in feature.")

                # Create an instance of your SQLAlchemy model for each earthquake
                # Replace 'EarthquakeModel' with your actual model class name
                earthquake_obj = Earthquake(
                    mag=properties.get("mag"),
                    place=properties.get("place"),
                    time=properties.get("time"),
                    title=properties.get("title"),
                    latitude=latitude,
                    longitude=longitude
                )

                earthquake_objects.append(earthquake_obj)


            # Add all the model instances to the session using db.add_all()
            db.add_all(earthquake_objects)
            db.commit()

            return earthquake_objects


    except httpx.HTTPStatusError as exc:
        # Try to extract the status code from the httpx exception, fallback to 502 (bad gateway)
        status_code = 502
        try:
            status_code = exc.response.status_code  # type: ignore[attr-defined]
        except Exception:
            pass
        raise HTTPException(status_code=status_code, detail="Error fetching data from USGS API")
    except Exception as e:
        # Rollback the session in case of an error
        try:
            db.rollback()
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/earthquakes/offline")
async def get_earthquakes_from_db(session: Session = Depends(get_session)):
    data = session.exec(select(Earthquake).limit(3)).all()
    return data
    

@router.get("/evacuation")
async def get_evacuation_data(session: Session = Depends(get_session)):
    data = session.exec(select(Evacuation)).all()
    return data

@router.post("/add/user_location", response_model=UserLocationCreate)
async def add_user_location(user: UserLocationCreate, session: Session = Depends(get_session)):
    new_user = UserLocation(email=user.email, latitude=user.latitude, longitude=user.longitude)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


def haversine(lat1, lon1, lat2, lon2):
    # returns distance in kilometers
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@router.get("/earthquakes/{earthquake_id}", response_model=Earthquake)
def get_earthquake(earthquake_id: int, session: Session = Depends(get_session)):
    eq = session.exec(select(Earthquake).where(Earthquake.id == earthquake_id)).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Earthquake not found")
    return eq

@router.get("/distance")
def get_distance(
    user_id: int = Query(...),
    alert_threshold_km: float = Query(100.0),
    session: Session = Depends(get_session),
):
    # get user location
    user = session.exec(select(UserLocation).where(UserLocation.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # latest earthquake
    earthquake = session.exec(select(Earthquake).order_by(Earthquake.time.desc())).first()
    if not earthquake:
        raise HTTPException(status_code=404, detail="No earthquake data")

    distance_km = haversine(user.latitude, user.longitude, earthquake.latitude, earthquake.longitude)
    alert = distance_km <= alert_threshold_km

    return {
        "earthquake_id": earthquake.id,
        "earthquake_time": earthquake.time,
        "earthquake_place": earthquake.place,
        "magnitude": earthquake.mag,
        "distance_km": distance_km,
        "alert": alert,
        "threshold_km": alert_threshold_km,
        # include coordinates so frontend can map directly
        "latitude": earthquake.latitude,
        "longitude": earthquake.longitude,
    }

@router.get("/user_location/{user_id}")
def get_user_location_by_id(user_id: int, session: Session = Depends(get_session)):
    user = session.exec(select(UserLocation).where(UserLocation.id == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User location not found")
    return user

@router.get("/user_location")
def get_user_location_by_email(email: Optional[str] = None, session: Session = Depends(get_session)):
    if email:
        user = session.exec(select(UserLocation).where(UserLocation.email == email)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User location not found")
        return user
    # fallback: return all saved user locations
    return session.exec(select(UserLocation)).all()
