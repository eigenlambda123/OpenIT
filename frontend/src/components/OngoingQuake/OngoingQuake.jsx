import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Flex, Grid,
  Heading, Text,
  Button,
  HStack,
  useToast,
  useColorModeValue
} from "@chakra-ui/react";
import axios from "axios";
import Minimap from "../Minimap";

function OngoingQuake() {
  const navigate = useNavigate();
  const [quakeData, setQuakeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Move all useColorModeValue calls to the top
  const bgColor = useColorModeValue("white", "gray.800");
  const mapBgColor = useColorModeValue("gray.100", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");
  const timeColor = useColorModeValue("gray.600", "gray.300");
  const alertColor = useColorModeValue("red.500", "red.300");
  const buttonsBgColor = useColorModeValue("gray.50", "gray.700");
  const viewMapBgColor = useColorModeValue("gray.200", "gray.600");
  const viewMapHoverBgColor = useColorModeValue("gray.300", "gray.500");

  const fetchQuakeData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE}/data/distance`, {
        params: {
          user_id: 1,
          alert_threshold_km: 50000
        }
      });

      if (response.data && response.data.alert) {
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
    } finally {
      setLoading(false);
    }
  }, [BASE, toast]);

  useEffect(() => {
    fetchQuakeData();
  }, [fetchQuakeData]);

  const handleViewMap = () => {
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
    
    navigate('/map', {
      state: {
        center: [Number(quakeData.latitude), Number(quakeData.longitude)],
        quake: quakeData
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
      const response = await axios.get(`${BASE}/data/evacuation`);
      navigate('/map', {
        state: {
          center: [quakeData.latitude, quakeData.longitude],
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
        bg={bgColor}
        boxShadow="sm"
      >
        <Box h="150px" w="100%" bg={mapBgColor}>
          {quakeData.latitude && quakeData.longitude && (
            <Minimap location={[Number(quakeData.latitude), Number(quakeData.longitude)]} />
          )}
        </Box>
        <Flex direction="column" gap="10px" p="10px">
          <Heading size="sm" color={headingColor}>
            {quakeData.earthquake_place}
          </Heading>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap="5px"
            w="100%"
          >
            <Text fontSize="15px" color={timeColor}>
              {new Date(Number(quakeData.earthquake_time)).toLocaleDateString()}
            </Text>
            <Text fontSize="sm" color={timeColor}>
              {new Date(Number(quakeData.earthquake_time)).toLocaleTimeString()}
            </Text>
            <Text fontSize="sm" color={alertColor} fontWeight="semibold">
              {quakeData.magnitude} Magnitude
            </Text>
            <Text fontSize="sm" color={alertColor} fontWeight="semibold">
              {Math.round(quakeData.distance_km)} km away
            </Text>
          </Grid>
        </Flex>
        <HStack w="100%" p="10px" bg={buttonsBgColor}>
          <Button 
            size={["sm", "md"]} 
            w="50%" 
            onClick={handleViewMap}
            variant="solid"
            bg={viewMapBgColor}
            _hover={{
              bg: viewMapHoverBgColor
            }}
          >
            View in Map
          </Button>
          <Button 
            size={["sm", "md"]} 
            w="50%" 
            onClick={handleEvacuate}
            colorScheme="red"
            variant="solid"
          >
            Evacuate
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}

export default OngoingQuake;