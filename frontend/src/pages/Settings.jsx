import {
  Box, Flex,
} from "@chakra-ui/react";

function Settings() {
  return (
    <Flex
      justify="center"
      p={["20px", "30px"]}
    >    
      <Flex direction="column" gap="20px" w="min(600px, 95%)">
        <Box></Box>
      </Flex>
    </Flex>
  );
}

export default Settings;