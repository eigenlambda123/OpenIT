import {
  Flex,
  Heading, Text,
} from "@chakra-ui/react";

function QuakeEntry({ quakeData }) {
  if (!quakeData) return;

  return (
    <Flex
      direction="column"
      w="100%"
      bg="gray.200"
      px={["10px", "20px"]}
      py={["5px", "10px"]}
    >
      <Heading size="sm">
        {quakeData.magnitude}
      </Heading>
      <Text>
        {quakeData.distance}
      </Text>
    </Flex>
  );
}

export default QuakeEntry;
