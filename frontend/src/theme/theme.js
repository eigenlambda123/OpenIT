import fonts from "./fonts";
import colors from "./colors";
import colorModeConfig from "./colorMode";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: colorModeConfig,
  fonts: fonts,
  colors,
})

export default theme;
