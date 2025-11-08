from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
from sqlmodel import Session
from ..utils import send_email
from ..db.database import get_session
from ..models.data import UserLocation, Earthquake
from .data import haversine

router = APIRouter(prefix="/email", tags=["email"])

@router.post("/send-alert")
async def send_earthquake_alert(
    background_tasks: BackgroundTasks, 
    user_id: int,
    db: Session = Depends(get_session)
):
    """
    Send earthquake alert email based on user's distance from latest earthquake.
    """
    # Get user location and email
    user = db.query(UserLocation).filter(UserLocation.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get latest earthquake
    earthquake = db.query(Earthquake).order_by(Earthquake.time.desc()).first()
    if not earthquake:
        raise HTTPException(status_code=404, detail="No earthquake data available")

    # Calculate distance
    distance_km = haversine(
        user.latitude, user.longitude,
        earthquake.latitude, earthquake.longitude
    )

    # Only send alert if within 50km
    if distance_km <= 500000:
        subject = f"⚠️ Earthquake Alert - {earthquake.mag} Magnitude"
        
        body = f"""
        <h2>🚨 Earthquake Alert</h2>
        <p>An earthquake has been detected near your location.</p>
        
        <h3>Details:</h3>
        <ul>
            <li><strong>Location:</strong> {earthquake.place}</li>
            <li><strong>Magnitude:</strong> {earthquake.mag}</li>
            <li><strong>Distance:</strong> {round(distance_km, 2)} km from your location</li>
            <li><strong>Time:</strong> {earthquake.time}</li>
        </ul>

        <h3>Safety Tips:</h3>
        <ul>
            <li>Drop, Cover, and Hold On</li>
            <li>Stay away from windows and exterior walls</li>
            <li>If you're in a car, pull over to a safe location</li>
            <li>Be prepared for aftershocks</li>
        </ul>

        <p>For evacuation centers and more information, visit our website.</p>
        """

        background_tasks.add_task(send_email, subject, [user.email], body)
        return {
            "message": f"Alert email sent to {user.email}",
            "distance": round(distance_km, 2),
            "magnitude": earthquake.mag
        }
    
    return {"message": "No alert needed - earthquake is too far"}