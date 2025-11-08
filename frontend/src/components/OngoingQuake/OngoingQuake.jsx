import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box, Flex, Grid,
  Heading, Text,
  Button,
  HStack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import Minimap from "../Minimap";

function OngoingQuake() {
  const navigate = useNavigate();
  const [quakeData, setQuakeData] = useState(null);
  const [nearbyEvacuations, setNearbyEvacuations] = useState([]);
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const toast = useToast();

  // Fetch latest earthquake and check distance
  useEffect(() => {
    const fetchQuakeData = async () => {
      try {
        const response = await axios.get(`${BASE}/data/distance`, {
          params: {
            user_id: 1,
            alert_threshold_km: 50000000
          }
        });

        console.log("Quake response:", response.data);

        // Check if we have valid data with alert=true
        if (response.data && response.data.alert) {
          // Set all the data we received
          setQuakeData({
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            earthquake_place: response.data.earthquake_place,
            earthquake_time: response.data.earthquake_time,
            magnitude: response.data.magnitude,
            distance_km: response.data.distance_km,
            earthquake_id: response.data.earthquake_id
          });
        }
      } catch (error) {
        console.error("Failed to fetch earthquake data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch earthquake data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchQuakeData();
  }, [BASE, toast]);

  const handleViewMap = () => {
    if (!quakeData?.latitude || !quakeData?.longitude) {
      console.error("Invalid coordinates:", quakeData);
      toast({
        title: "Error",
        description: "Could not load map - invalid coordinates",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    navigate('/map', {
      state: {
        center: [Number(quakeData.latitude), Number(quakeData.longitude)],
        quake: {
          ...quakeData,
          latitude: Number(quakeData.latitude),
          longitude: Number(quakeData.longitude)
        }
      }
    });
  };

  const handleEvacuate = async () => {
    if (!quakeData?.latitude || !quakeData?.longitude) {
      toast({
        title: "Error",
        description: "Invalid location data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.get(`${BASE}/data/evacuation`, {
        params: {
          latitude: Number(quakeData.latitude),
          longitude: Number(quakeData.longitude),
          radius_km: 50
        }
      });

      if (response.data.length === 0) {
        toast({
          title: "No Evacuation Centers Found",
          description: "No nearby evacuation centers found in your area",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // find nearest evacuation to the quake (haversine)
      const haversineKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const toRad = (v) => (v * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const evacuations = response.data;
      let nearest = evacuations[0];
      let minDist = haversineKm(quakeData.latitude, quakeData.longitude, nearest.latitude, nearest.longitude);

      for (let i = 1; i < evacuations.length; i++) {
        const e = evacuations[i];
        const d = haversineKm(quakeData.latitude, quakeData.longitude, e.latitude, e.longitude);
        if (d < minDist) {
          minDist = d;
          nearest = e;
        }
      }

      // navigate to map and include evacCenter so ZoomToEvac will zoom there
      navigate('/map', {
        state: {
          center: [quakeData.latitude, quakeData.longitude],
          evacCenter: [Number(nearest.latitude), Number(nearest.longitude)],
          quake: quakeData,
          showEvacuations: true,
          evacuations: evacuations
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch evacuation centers",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Only render if we have quakeData with earthquake_place
  if (!quakeData?.earthquake_place) return null;

  return (
    <Flex direction="column" gap="10px">
      <Heading size={["sm", "md"]}>Happening Right Now</Heading>
      <Flex
        outline="black"
        direction="column"
        borderRadius="10px"
        overflow="hidden"
        bg={useColorModeValue("gray.200", "gray.900")}
        sx={{filter: "drop-shadow(0px 0px 2px rgba(0, 0, 2, 0.3))"}}
      >
        <Box h="150px" w="100%">
          {quakeData.latitude && quakeData.longitude && (
            <Minimap location={[Number(quakeData.latitude), Number(quakeData.longitude)]} />
          )}
        </Box>
        <Flex direction="column" gap="10px" p="10px">
          <Heading size="sm">
            {quakeData.earthquake_place}
          </Heading>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap="5px"
            w="100%"
          >
            <Text fontSize="15px">
              {new Date(Number(quakeData.earthquake_time)).toLocaleDateString()}
            </Text>
            <Text fontSize="sm">
              {new Date(Number(quakeData.earthquake_time)).toLocaleTimeString()}
            </Text>
            <Text fontSize="sm" color="red.500">
              {quakeData.magnitude} Magnitude
            </Text>
            <Text fontSize="sm" color="red.500">
              {Math.round(quakeData.distance_km)} km away
            </Text>
          </Grid>
        </Flex>
        <HStack w="100%" p="10px">
          <Button size={["sm", "md"]} w="50%" onClick={handleViewMap}>
            View in Map
          </Button>
          <Button 
            size={["sm", "md"]} 
            w="50%" 
            onClick={handleEvacuate}
            colorScheme="red"
          >
            Evacuate
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}

export default OngoingQuake;