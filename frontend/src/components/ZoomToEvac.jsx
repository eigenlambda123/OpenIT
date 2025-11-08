import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMap } from "react-leaflet";

function ZoomToEvac() {
  const location = useLocation();
  const map = useMap();

  useEffect(() => {
    // prefer evacCenter, then userLocation from route state, then saved in localStorage, then center
    let target = null;
    let zoomLevel = 13;

    if (Array.isArray(location.state?.evacCenter) && location.state.evacCenter.length === 2) {
      target = location.state.evacCenter;
      zoomLevel = 16;
    } else if (Array.isArray(location.state?.userLocation) && location.state.userLocation.length === 2) {
      target = location.state.userLocation;
      zoomLevel = 13;
    } else {
      // try localStorage user_location
      try {
        const saved = localStorage.getItem('user_location');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.latitude !== undefined && parsed?.longitude !== undefined) {
            target = [Number(parsed.latitude), Number(parsed.longitude)];
            zoomLevel = 13;
          }
        }
      } catch (e) {
        // ignore
      }
    }

    // fallback to center from route state
    if (!target && Array.isArray(location.state?.center) && location.state.center.length === 2) {
      target = location.state.center;
      zoomLevel = 13;
    }

    if (target) {
      try {
        map.flyTo(target, zoomLevel, { duration: 1.2 });
      } catch (e) {
        console.warn("ZoomToEvac failed to flyTo:", e);
      }
    }
  }, [location.state, map]);

  return null;
}

export default ZoomToEvac;