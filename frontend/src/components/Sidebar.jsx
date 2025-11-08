import { NavLink } from "react-router-dom";
import {
  VStack,
  Image,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
  DrawerHeader, DrawerBody,
} from "@chakra-ui/react";

function Sidebar({ isOpen, onClose }) {
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Image src="/logo/LIGTAS.png" alt="LIGTAS Logo" w="100px" />
        </DrawerHeader>
        <DrawerBody>
          <VStack align="start">
            <NavLink to="/dashboard" onClick={onClose}>Dashboard</NavLink>
            <NavLink to="/map" onClick={onClose}>Map</NavLink>
            <NavLink to="/settings" onClick={onClose}>Settings</NavLink>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default Sidebar;
