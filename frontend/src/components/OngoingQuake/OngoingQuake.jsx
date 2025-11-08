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
            alert_threshold_km: 500000 // Set threshold to 50km
          }
        });

        if (response.data.alert) {
          setQuakeData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch earthquake data:", error);
      }
    };

    fetchQuakeData();
  }, []);

  const handleViewMap = () => {
    if (!quakeData) return;
    
    navigate('/map', {
      state: {
        center: [ quakeData.latitude, quakeData.longitude ],
        quake: quakeData
      }
    });
  };

  const handleEvacuate = async () => {
    try {
      // Fetch evacuation centers
      const response = await axios.get(`${BASE}/data/evacuation`);
      console.log(response.data);
      navigate('/map', {
        state: {
          center: [ quakeData.latitude, quakeData.longitude ],
          quake: quakeData,
          showEvacuations: true,
          evacuations: response.data
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

  // Only show if there's a nearby earthquake
  if (!quakeData) return null;

  return (
    <Flex direction="column" gap="10px">
      <Heading size={["sm", "md"]}>Happening Right Now</Heading>
      <Flex
        outline="black"
        direction="column"
        borderRadius="10px"
        overflow="hidden"
        bg="white"
        sx={{filter: "drop-shadow(0px 0px 2px rgba(0, 0, 2, 0.3))"}}
      >
        <Box h="150px" w="100%" bg="gray.200">
          <Minimap location={[quakeData.latitude, quakeData.longitude]} />
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
              {new Date(quakeData.earthquake_time).toLocaleDateString()}
            </Text>
            <Text fontSize="sm">
              {new Date(quakeData.earthquake_time).toLocaleTimeString()}
            </Text>
            <Text fontSize="sm" color={quakeData.magnitude >= 5 ? "red.500" : "black"}>
              {quakeData.magnitude} Magnitude
            </Text>
            <Text fontSize="sm" color="red.500">
              {Math.round(quakeData.distance_km)} km away
            </Text>
          </Grid>
        </Flex>
        <HStack w="100%" p="10px">
          <Button
            size={["sm", "md"]}
            w="50%"
            onClick={handleViewMap}
          >
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