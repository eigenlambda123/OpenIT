import {
  Flex,
  Heading, Text,
  useColorModeValue,
} from "@chakra-ui/react";

function GuideEntry({ guideData }) {
  const borderColor = guideData?.type === "do" ?
    "green.300" : "red.300";

  if (!guideData) return;
  
  return (
    <Flex
      direction="column"
      w="100%"
      bg="gray.200"
      borderLeft="5px solid"
      borderColor={borderColor}
      p="10px"
    >
      <Heading fontSize={["12px", "md"]}>
        {guideData.heading}
      </Heading>
      <Text fontSize={["10px", "sm"]}>
        {guideData.body}
      </Text>
    </Flex>
  );
}

export default GuideEntry;
