import {
  Flex,
  Heading, Text,
  useColorModeValue
} from "@chakra-ui/react";

function QuakeEntry({ quakeData }) {
  if (!quakeData) return;

  return (
    <Flex
      direction="column"
      w="100%"
      bg={useColorModeValue("gray.200", "gray.900")}
      p="10px"
    >
      <Heading fontSize={["12px", "md"]}>
        {`${quakeData.mag} Magnitude Earthquake`}
      </Heading>
      <Text fontSize={["10px", "sm"]}>
        {quakeData.place}
      </Text>
    </Flex>
  );
}

export default QuakeEntry;
