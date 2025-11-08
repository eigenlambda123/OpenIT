import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Heading,
  Box,
  Grid,
  Text,
  HStack,
  Button,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Minimap from "../Minimap";

function OngoingQuake() {

  const navigate = useNavigate();
  const toast = useToast();
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [quakeData, setQuakeData] = useState(null);
  const [nearbyEvacuations, setNearbyEvacuations] = useState([]);

  const bgColor = useColorModeValue("white", "gray.800");
  const mapBgColor = useColorModeValue("gray.100", "gray.900");
  const headingColor = useColorModeValue("gray.800", "white");
  const timeColor = useColorModeValue("gray.600", "gray.300");
  const alertColor = useColorModeValue("red.500", "red.300");
  const buttonsBgColor = useColorModeValue("gray.50", "gray.700");
  const viewMapBgColor = useColorModeValue("gray.200", "gray.600");
  const viewMapHoverBgColor = useColorModeValue("gray.300", "gray.500");

  
  useEffect(() => {
    let mounted = true;

    const fetchLatest = async () => {
      try {
        // fetch latest distance/quake info from backend
        const res = await fetch(`${BASE}/data/distance?user_id=1&alert_threshold_km=100000`);
        const data = await res.json();
        if (!mounted) return;
        // Expect data to contain earthquake info; adapt to your API shape
        if (data?.earthquake_place) {
          setQuakeData(data);
          // fetch nearby evacuations if API provides an endpoint
          // (optional) setNearbyEvacuations(await fetch(...))
        } else {
          setQuakeData(null);
        }
      } catch (err) {
        console.warn("OngoingQuake: failed to fetch:", err);
      }
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 30_000); // refresh periodically
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [BASE, toast]);

  const handleViewMap = () => {
    if (!quakeData) return;
    navigate("/map", { state: { quake: quakeData, evacuations: nearbyEvacuations } });
  };

  const handleEvacuate = async () => {
    toast({
      title: "Evacuate",
      description: "Evacuation flow not implemented here.",
      status: "info",
      duration: 4000,
    });
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

          <Grid templateColumns="repeat(2, 1fr)" gap="5px" w="100%">
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
            _hover={{ bg: viewMapHoverBgColor }}
            leftIcon={<SearchIcon />}
          >
            View in Map
          </Button>

          <Button size={["sm", "md"]} w="50%" onClick={handleEvacuate} colorScheme="red" variant="solid">
            Evacuate
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}

export default OngoingQuake;