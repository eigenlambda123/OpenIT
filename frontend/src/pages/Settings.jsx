import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Text
} from '@chakra-ui/react';
import axios from 'axios';

function Settings() {
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        status: "error",
        duration: 5000,
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        toast({
          title: "Error",
          description: "Failed to get location: " + error.message,
          status: "error",
          duration: 5000,
        });
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !location) {
      toast({
        title: "Error",
        description: "Please provide both email and location",
        status: "error",
        duration: 5000,
      });
      return;
    }

    try {
      const response = await axios.post(`${BASE}/data/add/user_location`, {
        email,
        latitude: location.latitude,
        longitude: location.longitude
      });

      toast({
        title: "Success",
        description: "Location saved successfully",
        status: "success",
        duration: 5000,
      });

      // Clear form
      setEmail('');
      setLocation(null);

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
    <Box p={4} maxW="600px" mx="auto">
      <VStack spacing={6} align="stretch">
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
            </FormControl>

            <Button
              type="submit"
              colorScheme="green"
              isDisabled={!email || !location}
              w="100%"
            >
              Save Settings
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}

export default Settings;