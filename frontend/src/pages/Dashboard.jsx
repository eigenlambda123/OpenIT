import { useEffect, useState } from "react";
import {
  Box, 
  Flex,
  useToast
} from "@chakra-ui/react";
import OngoingQuake from "../components/OngoingQuake/OngoingQuake";
import RecentQuakes from "../components/RecentQuakes/RecentQuakes";
import QuakeGuides from "../components/QuakeGuides/QuakeGuides";
import { getEarthquakes } from "../api/quakes";
import axios from "axios";

function Dashboard() {
  const [quakeData, setQuakeData] = useState([]);
  const [lastAlertId, setLastAlertId] = useState(null);
  const toast = useToast();

  // Fetch initial earthquake data
  useEffect(() => {
    async function fetchEarthquakes() {
      try {
        const res = await getEarthquakes();
        setQuakeData(res);
      } catch (err) {
        console.error("Failed to fetch earthquakes:", err);
        toast({
          title: "Error",
          description: "Failed to fetch earthquake data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    fetchEarthquakes();
  }, []);

  // Alert system
  useEffect(() => {
    const checkEarthquakeAlerts = async () => {
      try {
        const res = await axios.get("/api/data/distance", {
          params: {
            user_id: 1,
            alert_threshold_km: 100 // Set to 100km or adjust as needed
          }
        });
        
        const { earthquake_id, alert, distance_km, earthquake_place, magnitude } = res.data;

        if (alert && earthquake_id !== lastAlertId) {
          setLastAlertId(earthquake_id);
          toast({
            title: "⚠️ Earthquake Alert!",
            description: `Magnitude ${magnitude} earthquake detected ${Math.round(distance_km)}km away at ${earthquake_place}`,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "top",
          });
        }
      } catch (error) {
        console.error("Failed to check earthquake alerts:", error);
      }
    };

    const interval = setInterval(checkEarthquakeAlerts, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [lastAlertId, toast]);

  return (
    <Box px={["20px", "30px"]} py={["10px", "20px"]} display="flex" flexDirection="column">    
      <Flex direction="column" gap="20px">
        <OngoingQuake />
        <RecentQuakes quakeData={quakeData} />
        <QuakeGuides />
      </Flex>
    </Box>
  );
}

export default Dashboard;
