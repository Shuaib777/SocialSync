import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketsContext.jsx";

const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "gray.50")(props),
      bg: mode("gray.100", "gray.900")(props),
      fontFamily: "Inter, system-ui, sans-serif",
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  brand: {
    50: "#e3f2ff",
    100: "#b3daff",
    200: "#80c1ff",
    300: "#4da8ff",
    400: "#1a8fff",
    500: "#0077e6",
    600: "#005bb4",
    700: "#004182",
    800: "#002751",
    900: "#000c21",
  },
  gray: {
    50: "#f9f9f9",
    100: "#f0f0f0",
    200: "#e0e0e0",
    300: "#cfcfcf",
    400: "#b0b0b0",
    500: "#909090",
    600: "#616161",
    700: "#424242",
    800: "#1e1e1e",
    900: "#0d0d0d",
  },
};

const textStyles = {
  heading: {
    fontSize: ["2xl", "3xl", "4xl"],
    fontWeight: "bold",
    lineHeight: "short",
  },
  body: { fontSize: ["sm", "md", "lg"], lineHeight: "tall" },
};

const theme = extendTheme({ styles, config, colors, textStyles });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
