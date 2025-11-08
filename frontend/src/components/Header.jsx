import { useState } from "react";
import {
	Flex, HStack, Spacer,
	Button,
	Image,
	useColorMode, useColorModeValue,
	useDisclosure,
	IconButton,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

function Header() {
	const { colorMode, toggleColorMode } = useColorMode();
	const { isOpen, onOpen, onClose } = useDisclosure()

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
			<Sidebar isOpen={isOpen} onClose={onClose} />
			<Flex
        as="header"
				bg={useColorModeValue("brand.600", "brand.400")}
        px={["20px", "30px"]}
				py={["10px", "20px"]}
				justify="center"
        position="sticky"
        top="0"
        zIndex="100"
      >
				<Flex align="center" w="min(600px, 95%)">
					<Image src="/logo/LIGTAS.png" alt="LIGTAS Logo" w="100px" />
					<Spacer />
					<HStack spacing="5px" align="center">
						<IconButton
							variant="ghost"
							icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
							onClick={toggleColorMode}
							aria-label="Toggle Color Mode"
							size="lg"
						/>
						<IconButton
							variant="ghost"
							icon={<Menu size={24} />}
							onClick={onOpen}
							aria-label="Open Menu"
							size="lg"
						/>
					</HStack>
				</Flex>
			</Flex>
		</>
	);
}

export default Header;
