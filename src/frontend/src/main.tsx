import React from "react";
import ReactDOM from "react-dom/client";
import { ColorModeScript } from "@chakra-ui/react";

import { App } from "~/core/app";
import { chakraThemeConfig } from "~/core/theme";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={chakraThemeConfig.initialColorMode} />
    <App />
  </React.StrictMode>
);
