import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMap } from "react-leaflet";

function ZoomToEvac() {
  const location = useLocation();
  const map = useMap();

  useEffect(() => {
    if (location.state?.center) {
      const coords = location.state.center;
      map.flyTo(coords, 18, { duration: 1.2 });
    }
  }, [location.state, map]);

  return null;
}

export default ZoomToEvac;