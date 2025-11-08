import { useLocation } from 'react-router-dom';
import {
  Flex,
  Box,
  Text
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import ZoomToEvac from '../components/ZoomToEvac';
import L from 'leaflet';

// Create custom icons for earthquake and evacuation centers
const quakeIcon = new L.Icon({
  iconUrl: '/earthquake.png',
  iconSize: [32, 32],
});

const evacuationIcon = new L.Icon({
  iconUrl: '/evacuation.png',
  iconSize: [32, 32],
});

function Map() {
  const location = useLocation();
  const center = location.state?.center || [13.9373, 121.6166]; // Default to Lucena City
  const quake = location.state?.quake;
  const evacuations = location.state?.evacuations || [];

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
          
          {/* Earthquake Marker */}
          {quake && (
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
