import { useEffect, useState } from "react";
import { Flex } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function FlyToUser({ target, zoom = 15 }) {
  const map = useMap();

  useEffect(() => {
    if (!target || !Array.isArray(target) || target.length !== 2) return;
    try {
      map.flyTo(target, zoom, { duration: 0.8 });
    } catch (e) {
      console.warn('FlyToUser failed:', e);
    }
  }, [map, target, zoom]);

  return null;
}

function Minimap() {
  const [userLocation, setUserLocation] = useState(null);
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    let mounted = true;

    const fetchUserLocation = async () => {
      try {
        // adjust user id or query as needed
        const res = await axios.get(`${BASE}/data/user_location/1`, { timeout: 5000 });
        const data = res?.data;
        if (mounted && data?.latitude !== undefined && data?.longitude !== undefined) {
          setUserLocation([Number(data.latitude), Number(data.longitude)]);
          return;
        }
      } catch (err) {
        // silent fallback to localStorage
        console.warn('Failed to fetch user location from API, falling back to localStorage', err);
      }

      // fallback to localStorage
      try {
        const saved = localStorage.getItem('user_location');
        if (mounted && saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.latitude !== undefined && parsed?.longitude !== undefined) {
            setUserLocation([Number(parsed.latitude), Number(parsed.longitude)]);
          }
        }
      } catch (e) {
        console.warn('Failed to parse user_location from localStorage', e);
      }
    };

    fetchUserLocation();
    return () => { mounted = false; };
  }, [BASE]);

  const center = userLocation ?? [51.505, -0.09];

  return (
    <Flex direction="column" h="100%" w="100%">
      <Flex h="100%" w="100%" position="relative">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='<a href="https://www.openstreetmap.org/copyright"></a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* fly to user when available */}
          {userLocation && <FlyToUser target={userLocation} zoom={15} />}

          <Marker position={center}>
            <Popup>
              {userLocation ? 'You are here' : 'Default location'}
            </Popup>
          </Marker>

          {userLocation && (
            <CircleMarker
              center={userLocation}
              pathOptions={{ color: 'blue', fillColor: 'blue' }}
              radius={6}
            >
              <Popup>You are here</Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </Flex>
    </Flex>
  );
}

export default Minimap;
