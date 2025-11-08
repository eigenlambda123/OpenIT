import {
  Box, Flex,
} from "@chakra-ui/react";
import OngoingQuake from "../components/OngoingQuake/OngoingQuake";
import RecentQuakes from "../components/RecentQuakes/RecentQuakes";
import QuakeGuides from "../components/QuakeGuides/QuakeGuides";

function Dashboard() {
  return (
    <Box px={["20px", "30px"]} py={["10px", "20px"]} display="flex" flexDirection="column">    
      <Flex direction="column" gap="20px">
        <OngoingQuake />
        <RecentQuakes />
        <QuakeGuides />
      </Flex>
    </Box>
  );
}

export default Dashboard;
