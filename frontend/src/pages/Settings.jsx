import { useState } from 'react';
import {
  Flex, VStack,
  Heading, Text,
  Button,
  FormControl, FormLabel, Input,
  useToast,
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
        description: "Please provide email",
        status: "error",
        duration: 5000,
      });
      return;
    }

  return (
    <Flex
      justify="center"
      p={["20px", "30px"]}
    >
      <Flex direction="column" gap="20px" w="min(600px, 95%)">


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
      </Flex>
    </Flex>
  );
}

export default Settings;