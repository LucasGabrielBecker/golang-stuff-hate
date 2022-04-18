/* @refresh reload */
import { render } from "solid-js/web";
import { HopeProvider, HopeThemeConfig, globalCss } from "@hope-ui/solid";

import App from "./App";

const config: HopeThemeConfig = {
  lightTheme: {
    colors: {
      primary: "#222831",
      secondary: "#393E46",
      therthiary: "#00ADB5",
      light: "#EEEEEE",
    },
  },
};

render(
  () => (
    <HopeProvider config={config}>
      <App />
    </HopeProvider>
  ),
  document.getElementById("root") as HTMLElement
);
