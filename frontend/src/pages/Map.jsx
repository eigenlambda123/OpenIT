import {
  Box, Flex
} from '@chakra-ui/react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

function Map() {
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
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "calc(100% - 60px)", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </Flex>
    </Flex>
  );
}

export default Map;
  