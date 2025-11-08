import { useEffect, useState } from 'react';
import {
  Flex, VStack,
  Heading, Text,
  Button,
  FormControl, FormLabel, Input,
  useToast,
  FormHelperText,
} from '@chakra-ui/react';
import axios from 'axios';

function Settings() {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // load saved location (if any) so we don't need a "Get Current Location" button
  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.latitude !== undefined && parsed?.longitude !== undefined) {
          setLocation({ latitude: Number(parsed.latitude), longitude: Number(parsed.longitude) });
        }
      }
    } catch (e) {
      console.warn('Failed to read user_location from localStorage', e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // attempt to use current state location, otherwise try localStorage
    let loc = location;
    if (!loc) {
      try {
        const saved = localStorage.getItem('user_location');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.latitude !== undefined && parsed?.longitude !== undefined) {
            loc = { latitude: Number(parsed.latitude), longitude: Number(parsed.longitude) };
          }
        }
      } catch (e) {
        console.warn('Failed to read user_location from localStorage', e);
      }
    }

    if (!email) {
      toast({
        title: "Error",
        description: "Please provide an email",
        status: "error",
        duration: 5000,
      });
      return;
    }

    if (!loc) {
      toast({
        title: "No location",
        description: "No saved location found. Set your location from the Dashboard location modal first.",
        status: "warning",
        duration: 5000,
      });
      return;
    }

    try {
      const response = await axios.post(`${BASE}/data/add/user_location`, {
        email,
        latitude: loc.latitude,
        longitude: loc.longitude
      });

      toast({
        title: "Success",
        description: "Location saved successfully",
        status: "success",
        duration: 5000,
      });

      // Clear email but keep location (it's saved)
      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to save location",
        status: "error",
        duration: 5000,
      });
    }
  };

  return (
    <Flex
      justify="center"
      p={["20px", "30px"]}
    >
      <Flex direction="column" gap="20px" w="min(600px, 95%)">
        <Heading size="lg">Settings</Heading>
        <Text>
          Set your email to receive earthquake alerts. Your location is read from the saved location (Dashboard).
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              <FormHelperText>
                Provide your email to receive earthquake alerts
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Location (saved)</FormLabel>
              {location ? (
                <Text>
                  Latitude: {location.latitude.toFixed(4)}<br />
                  Longitude: {location.longitude.toFixed(4)}
                </Text>
              ) : (
                <Text color="gray.500">No saved location found. Open Dashboard to set location.</Text>
              )}
            </FormControl>

            <Button
              type="submit"
              colorScheme="green"
              isDisabled={!email}
              w="100%"
            >
              Save Settings
            </Button>
          </VStack>
        </form>
      </Flex>
    </Flex>
  );
}

export default Settings;