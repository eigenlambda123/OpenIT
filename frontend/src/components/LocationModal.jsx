import { useState } from 'react';
import {
  Heading, Text,
  Button,
  useToast,
  VStack,
  HStack,
  Box,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import { MapPin } from 'lucide-react';
import axios from 'axios';

function LocationModal({ isOpen, onClose, setLocation, location = null }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const cardBg = useColorModeValue('white', 'gray.800');
  const secondaryText = useColorModeValue('gray.600', 'gray.300');

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
        toast({
          title: "Location captured",
          description: "Your current coordinates have been detected.",
          status: "success",
          duration: 3000,
        });
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

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent bg={cardBg} borderRadius="lg" mx={4}>
        <ModalHeader>
          <HStack spacing={3} align="center">
            <Icon as={MapPin} boxSize={5} />
            <Heading size="sm">Set Your Location</Heading>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text color={secondaryText}>
              We need your approximate location to provide nearby evacuation information and alerts.
            </Text>

            <Box p={4} borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
              {location ? (
                <VStack align="start" spacing={1}>
                  <Text fontWeight="semibold">Detected coordinates</Text>
                  <Text fontSize="sm" color={secondaryText}>
                    Latitude: {Number(location.latitude).toFixed(6)}
                  </Text>
                  <Text fontSize="sm" color={secondaryText}>
                    Longitude: {Number(location.longitude).toFixed(6)}
                  </Text>
                  <Text fontSize="xs" color={secondaryText}>
                    You can update these by clicking "Get Current Location" again.
                  </Text>
                </VStack>
              ) : (
                <Text color={secondaryText}>No location set yet. Click the button below to detect your location.</Text>
              )}
            </Box>

            <Button colorScheme="blue" onClick={handleGetLocation} isLoading={loading}>
              {location ? "Update Location" : "Get Current Location"}
            </Button>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="ghost" onClick={handleClose}>Close</Button>
            <Button
              colorScheme="green"
              onClick={() => {
                if (!location) {
                  toast({ title: "No location", description: "Please get your current location first.", status: "warning", duration: 3000 });
                  return;
                }
                try {
                  localStorage.setItem("user_location", JSON.stringify(location));
                  setLocation(location); // update parent state
                } catch (e) {
                  console.warn("Failed to save location to localStorage", e);
                }
                toast({ title: "Location saved", description: "You can change this later in Settings.", status: "success", duration: 3000 });
                handleClose();
              }}
            >
              Use this location
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LocationModal;
