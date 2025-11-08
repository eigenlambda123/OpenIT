import { useEffect, useState } from "react";
import {
  Flex,
  useToast,
} from "@chakra-ui/react";
import OngoingQuake from "../components/OngoingQuake/OngoingQuake";
import RecentQuakes from "../components/RecentQuakes/RecentQuakes";
import QuakeGuides from "../components/QuakeGuides/QuakeGuides";
import { getEarthquakes } from "../api/quakes";
import axios from "axios";

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

  const [lastAlertId, setLastAlertId] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await axios.get("/data/distance?user_id=1&alert_threshold_km=1000000");
      const { earthquake_id, alert } = res.data;

      if (alert && earthquake_id !== lastAlertId) {
        setLastAlertId(earthquake_id);
        console.log(earthquake_id);
        toast({
          title: "Earthquake Alert!",
          description: `You are ${res.data.distance_km} km away from ${res.data.earthquake_place}.`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [lastAlertId, toast]);

  return (
    <Flex
      justify="center"
      p={["20px", "30px"]}
    >    
      <Flex direction="column" gap="20px" w="min(600px, 95%)">
        <OngoingQuake />
        <RecentQuakes quakeData={quakeData} />
        <QuakeGuides />
      </Flex>
    </Flex>
  );
}

export default Dashboard;
