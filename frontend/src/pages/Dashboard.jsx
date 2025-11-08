import { useEffect, useState } from "react";
import {
  Box, Flex,
} from "@chakra-ui/react";
import OngoingQuake from "../components/OngoingQuake/OngoingQuake";
import RecentQuakes from "../components/RecentQuakes/RecentQuakes";
import QuakeGuides from "../components/QuakeGuides/QuakeGuides";
import { getEarthquakes } from "../api/quakes";

function Dashboard() {
  const [quakeData, setQuakeData] = useState([]);

  useEffect(() => {
    async function fetchEarthquakes() {
      try {
        const res = await getEarthquakes();
        setQuakeData(res);
      } catch (err) {
        console.error("Failed to fetch earthquakes:", err);
      }
    }
    fetchEarthquakes();
  }, []);

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
