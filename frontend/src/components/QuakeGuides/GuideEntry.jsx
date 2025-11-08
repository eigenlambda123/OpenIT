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
      px={["10px", "20px"]}
      py={["5px", "10px"]}
    >
      <Heading size="sm">
        {guideData.heading}
      </Heading>
      <Text>
        {guideData.body}
      </Text>
    </Flex>
  );
}

export default GuideEntry;
