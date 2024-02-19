import ReactDOM from "react-dom/client";
import "./index.css";
import { Router } from "./router/index.tsx";
import { HashRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import useLocalStorageState from "use-local-storage-state";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import React, { createContext, useMemo, useState } from "react";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const Root: React.FC = () => {
  const [storageThemeMode, setStorageThemeMode] = useLocalStorageState<
    "light" | "dark"
  >("themeMode", {
    defaultValue: useMediaQuery("(prefers-color-scheme: dark)")
      ? "dark"
      : "light",
  });

  const [mode, setMode] = useState<"light" | "dark">(storageThemeMode);
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const targetMode = mode === "light" ? "dark" : "light";
        setMode(targetMode);
        setStorageThemeMode(targetMode);
      },
    }),
    [mode, setStorageThemeMode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );
  return (
    <HelmetProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HashRouter>
            <Router />
          </HashRouter>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </HelmetProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
