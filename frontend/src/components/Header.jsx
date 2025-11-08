import {
	Flex, HStack, Spacer,
	Heading, Button,
	useColorMode, useColorModeValue,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

function Header() {
	const { colorMode, toggleColorMode } = useColorMode();

	const bgColor = {
    8: useColorModeValue("red.700", "red.700"),
    7: useColorModeValue("red.600", "red.600"),
    6: useColorModeValue("red.500", "red.500"),
    5: useColorModeValue("orange.500", "orange.500"),
    4: useColorModeValue("orange.400", "orange.400"),
    3: useColorModeValue("yellow.500", "yellow.500"),
    2: useColorModeValue("yellow.400", "yellow.400"),
  }

	return (
		<>
			<Flex
        as="header"
        bg={bgColor[6]}
        px={["20px", "30px"]} py={["10px", "20px"]}
        align="center"
        position="sticky"
        top="0"
        zIndex="100"
      >
				<Heading as="h1" size="md">Earthquake</Heading>
				<Spacer />
				<HStack spacing="16px" align="center">
					<Button onClick={toggleColorMode} bg="none" p="8px">
						{colorMode === "light" ? <SunIcon color="yellow.500" /> : <MoonIcon color="yellow.500" />}
					</Button>
				</HStack>
			</Flex>
		</>
	);
}

export default Header;
