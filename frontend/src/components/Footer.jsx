import { 
  Box, Flex,
  Text,
  useColorModeValue
} from "@chakra-ui/react"

function Footer() {
  const bgColor = useColorModeValue("white", "gray.800");

  const currentYear = new Date().getFullYear(); 

  return (
    <Flex 
        as="footer"
        bg={bgColor}
        px={["20px", "30px"]}
        py={["10px", "20px"]}
        justify="center"
        mt="auto"
    >
      <Box align="center" w="min(600px, 95%)">
        <Text fontSize="sm" textAlign="center">
          &copy; {currentYear} QuannOX Byte. All rights reserved.
        </Text>
      </Box>
    </Flex>
  )
}

export default Footer;
