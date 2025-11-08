import { SearchIcon } from "@chakra-ui/icons";
import {
  Box, Flex, Grid,
  Heading, Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import Minimap from "../Minimap";

function OngoingQuake() {
  return (
    <Flex direction="column" gap="10px">
      <Heading size={["sm", "md"]}>Happening Right Now</Heading>
      <Flex
        outline="black"
        direction="column"
        borderRadius="10px"
        overflow="hidden"
        bg="white"
        sx={{filter: "drop-shadow(0px 0px 2px rgba(0, 0, 2, 0.3))"}}
      >
        <Box h="100px" w="100%" bg="gray.200">
          <Minimap />
        </Box>
        <Flex direction="column" gap="10px" p="10px">
          <Heading size="sm">
            Lucena City
          </Heading>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap="5px"
            w="100%"
          >
            <Text fontSize="15px">
              November 9, 2025
            </Text>
            <Text fontSize="sm">
              7:00 PM
            </Text>
            <Text fontSize="sm">
              5.5 Magnitude
            </Text>
            <Text fontSize="sm">
              Lumikas!
            </Text>
          </Grid>
        </Flex>
        <HStack w="100%" p="10px">
          <Button size={["sm", "md"]} w="50%">
            View in Map
          </Button>
          <Button size={["sm", "md"]} w="50%">
            Evacuate
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}

export default OngoingQuake;