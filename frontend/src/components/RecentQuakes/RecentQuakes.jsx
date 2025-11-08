import {
  Box, Flex,
  Heading,
} from "@chakra-ui/react";
import QuakeEntry from "./QuakeEntry";

function RecentQuakes() {
  const quakeData = [
    {
      id: 1,
      magnitude: 4.6,
      distance:"45km"
    },
    {
      id: 2,
      magnitude: 4.6,
      distance:"45km"
    },
    {
      id: 3,
      magnitude: 4.6,
      distance:"45km"
    }
  ];

  return (
    <Flex direction="column" gap="10px">
      <Heading size={["sm", "md"]}>Recent Earthquakes</Heading>
      <Flex direction="column" borderRadius="10px" overflow="hidden">
        {quakeData.map(data => (
          <QuakeEntry key={data.id} quakeData={data} />
        ))}
      </Flex>
    </Flex>
  );
}

export default RecentQuakes;
