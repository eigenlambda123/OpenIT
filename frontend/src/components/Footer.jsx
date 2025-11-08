import { 
  Flex,
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
        px="30px"
        py="20px"
        justify="center"
        mt="auto"
    >
      <Text fontSize="sm">
        &copy; {currentYear} QuannOX Byte. All rights reserved.
      </Text>
    </Flex>
  )
}

export default Footer;
