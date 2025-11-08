import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import {
  Flex,
  Box,
  Text
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import ZoomToEvac from '../components/ZoomToEvac';
import L from 'leaflet';
import axios from 'axios';

// Create custom icons for earthquake and evacuation centers
const quakeIcon = new L.Icon({
  iconUrl: '/earthquake.png',
  iconSize: [32, 32],
});

const evacuationIcon = new L.Icon({
  iconUrl: '/evacuation.png',
  iconSize: [32, 32],
});

function FlyToUser({ target, zoom = 13 }) {
  const map = useMap();

  useEffect(() => {
    if (!target || !Array.isArray(target) || target.length !== 2) return;
    try {
      map.flyTo(target, zoom, { duration: 0.9 });
    } catch (e) {
      console.warn("FlyToUser failed:", e);
    }
  }, [map, target, zoom]);

  return null;
}

function Map() {
  const location = useLocation();
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // userLocation stored as { latitude, longitude } or null
  const [userLocation, setUserLocation] = useState(null);

  // try backend endpoint first, then localStorage
  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE}/data/user_location/1`, { timeout: 5000 });
        const data = res?.data;
        if (mounted && data?.latitude !== undefined && data?.longitude !== undefined) {
          setUserLocation({ latitude: Number(data.latitude), longitude: Number(data.longitude) });
          return;
        }
      } catch (err) {
        // ignore, fall back to localStorage
        console.warn("Failed to fetch user_location from API, falling back to localStorage", err);
      }

      try {
        const saved = localStorage.getItem('user_location');
        if (mounted && saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.latitude !== undefined && parsed?.longitude !== undefined) {
            setUserLocation({ latitude: Number(parsed.latitude), longitude: Number(parsed.longitude) });
          }
        }
      } catch (e) {
        console.warn("Failed to parse user_location from localStorage", e);
      }
    };

    fetchUser();
    return () => { mounted = false; };
  }, [BASE]);

  // try read user location from route state too (prefer route)
  const userFromState = location.state?.userLocation;
  if (userFromState && (!userLocation ||
      userLocation.latitude !== Number(userFromState[0]) ||
      userLocation.longitude !== Number(userFromState[1])
    )) {
    // keep userLocation consistent if route state passed
    setUserLocation({ latitude: Number(userFromState[0]), longitude: Number(userFromState[1]) });
  }

  // center priority: provided center -> user location -> default
  const center = location.state?.center 
    ?? (userLocation ? [userLocation.latitude, userLocation.longitude] : [13.9373, 121.6166]);

  const quake = location.state?.quake;
  const evacuations = location.state?.evacuations || [];

  // Only fly to user when there is a userLocation and there is no evacCenter in route state
  const shouldFlyToUser = !!userLocation && !Array.isArray(location.state?.evacCenter);

  return (
    <Flex
      direction="column"
      maxH="100vh"
      maxW="100vw"
    >
      <Flex
        h="100vh"
        w="100%"
        position="relative"
      >
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "calc(100% - 60px)", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomToEvac />

          {/* Fly to user if appropriate (won't run if evacCenter present) */}
          {shouldFlyToUser && <FlyToUser target={[userLocation.latitude, userLocation.longitude]} zoom={13} />}

          {/* User location marker (blue circle) */}
          {userLocation && (
            <CircleMarker
              center={[userLocation.latitude, userLocation.longitude]}
              pathOptions={{ color: 'blue', fillColor: 'blue' }}
              radius={8}
            >
              <Popup>
                <Box p={2}>
                  <Text fontWeight="bold">You are here</Text>
                  <Text fontSize="sm">Lat: {userLocation.latitude.toFixed(4)}</Text>
                  <Text fontSize="sm">Lng: {userLocation.longitude.toFixed(4)}</Text>
                </Box>
              </Popup>
            </CircleMarker>
          )}
          
          {/* Earthquake Marker */}
          {quake && quake.latitude !== undefined && quake.longitude !== undefined && (
            <Marker position={[quake.latitude, quake.longitude]} icon={quakeIcon}>
              <Popup>
                <Box p={2}>
                  <Text fontWeight="bold">{quake.magnitude} Magnitude Earthquake</Text>
                  <Text>{quake.earthquake_place}</Text>
                  <Text>{Math.round(quake.distance_km)}km away</Text>
                </Box>
              </Popup>
            </Marker>
          )}

          {/* Evacuation Center Markers */}
          {evacuations.map(evac => (
            <Marker 
              key={evac.id}
              position={[evac.latitude, evac.longitude]}
              icon={evacuationIcon}
            >
              <Popup>
                <Box p={2}>
                  <Text fontWeight="bold">{evac.name}</Text>
                  <Text>{evac.type}</Text>
                  <Text fontSize="sm">{evac.description}</Text>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Flex>
    </Flex>
  );
}

export default Map;
