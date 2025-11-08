import {
	Flex, HStack, Spacer,
	Heading, Button,
	useColorMode, useColorModeValue,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

function TopNavbar() {
	const { colorMode, toggleColorMode } = useColorMode();

	const bgColor = useColorModeValue("white", "gray.800");

	return (
		<>
			<Flex
        as="header"
        bg={bgColor}
        px="30px"
        py="20px"
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

export default TopNavbar;
