import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Flex } from "@chakra-ui/react";

function RootLayout() {
	return (
		<Flex
      direction="column"
      minH="100vh"
    >
			<Header />
			<Outlet />
			<Footer />
		</Flex>
	);
}

export default RootLayout;
