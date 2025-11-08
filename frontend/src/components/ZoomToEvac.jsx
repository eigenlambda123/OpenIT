import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMap } from "react-leaflet";

function ZoomToEvac() {
  const location = useLocation();
  const map = useMap();

  useEffect(() => {
    const target = location.state?.evacCenter ?? location.state?.center;
    if (target && Array.isArray(target) && target.length === 2) {
      const zoomLevel = location.state?.evacCenter ? 16 : 13;
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