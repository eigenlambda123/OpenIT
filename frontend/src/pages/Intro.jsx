import {
  Flex,
  Image,
  Spinner,
} from "@chakra-ui/react";

function Intro() {
  return (
    <Flex
      justify="center"
      align="center"
      p={["20px", "30px"]}
      h="100vh"
    >    
      <Flex
        direction="column"
        justify="center"
        align="center"
        gap="20px"
        w="min(600px, 95%)"
      >
        <Image src="/logo/LIGTAS.png" alt="LIGTAS Logo" />
        <Spinner />
      </Flex>
    </Flex>
  );
}

export default Intro;