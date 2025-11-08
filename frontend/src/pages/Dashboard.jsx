import { useEffect, useState } from "react";
import {
  Flex,
  useToast,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import OngoingQuake from "../components/OngoingQuake/OngoingQuake";
import RecentQuakes from "../components/RecentQuakes/RecentQuakes";
import QuakeGuides from "../components/QuakeGuides/QuakeGuides";
import { getEarthquakes } from "../api/quakes";
import axios from "axios";
import LocationModal from "../components/locationModal";

function Dashboard() {
  const [quakeData, setQuakeData] = useState([]);
  const [lastAlertId, setLastAlertId] = useState(null);

  const [location, setLocation] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

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

  // on mount, try load saved location; only open modal when none saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user_location");
      if (saved) {
        setLocation(JSON.parse(saved));
      } else {
        onOpen();
      }
    } catch (e) {
      console.warn("Failed to read user_location from localStorage", e);
      onOpen();
    }
  }, [onOpen]);

  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleFetchAndCheck = async () => {
    try {
      // fetch latest earthquakes (use proper template literal)
      await axios.get(`${BASE}/data/earthquakes`, { timeout: 15000 });
      setLastAlertId(null);

      const res = await axios.get(`${BASE}/data/distance`, {
        params: { user_id: 1, alert_threshold_km: 100000 },
        timeout: 10000,
      });

      const { earthquake_id, alert, distance_km, earthquake_place, magnitude } = res.data ?? {};
      console.log("[manual fetch] distance response:", res.data);

      if (alert) {
        setLastAlertId(earthquake_id);
        toast({
          title: "Earthquake Alert",
          description: `Magnitude ${magnitude} — ${Math.round(distance_km)} km away at ${earthquake_place}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (err) {
      console.error("fetch&check failed:", err?.response?.data ?? err.message ?? err);
      toast({
        title: "Error",
        description: "Failed to fetch or check earthquakes",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {!location && (
        <LocationModal isOpen={isOpen} onClose={onClose} setLocation={setLocation}/>
      )}

      <Flex
        justify="center"
        p={["20px", "30px"]}
      >
        <Flex direction="column" gap="20px" w="min(600px, 95%)">
          <Button size="sm" alignSelf="flex-end" onClick={handleFetchAndCheck}>Fetch new quakes & check</Button>
          <OngoingQuake />
          <RecentQuakes quakeData={quakeData} />
          <QuakeGuides />
        </Flex>
      </Flex>
    </>
  );
}

export default Dashboard;