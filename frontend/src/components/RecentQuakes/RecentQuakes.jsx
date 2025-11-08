import { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/react";
import QuakeEntry from "./QuakeEntry";
import axios from "axios";

function RecentQuakes() {
  const [quakeData, setQuakeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchQuakes = async () => {
      setLoading(true);
      try {
        // Try online endpoint
        const onlineRes = await axios.get(`${BASE}/data/earthquakes`);
        if (onlineRes.data && onlineRes.data.length > 0) {
          setQuakeData(onlineRes.data);
          return;
        }

        // Fallback to offline if online returns empty
        const offlineRes = await axios.get(`${BASE}/data/earthquakes/offline`);
        setQuakeData(offlineRes.data);
        
      } catch (error) {
        console.error("Failed to fetch earthquakes:", error);
        setError("Failed to load earthquake data");
        
        // Try offline endpoint if online fails
        try {
          const offlineRes = await axios.get(`${BASE}/data/earthquakes/offline`);
          setQuakeData(offlineRes.data);
          setError(null);
        } catch (offlineError) {
          console.error("Offline fetch also failed:", offlineError);
          setError("Could not load earthquake data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuakes();
  }, [BASE]);

  if (loading) {
    return (
      <Flex justify="center" py={4}>
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" py={4}>
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="10px">
      <Heading size={["sm", "md"]}>Recent Earthquakes</Heading>
      <Flex direction="column" gap="2px" borderRadius="10px" overflow="hidden">
        {quakeData.map(data => (
          <QuakeEntry 
            key={data.id || data.title} 
            quakeData={data} 
          />
        ))}
      </Flex>
    </Flex>
  );
}

export default RecentQuakes;
