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
import { ConfirmProvider } from "material-ui-confirm";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

interface PlatformDrawerContextProps {
  drawerVisible: boolean;
  setDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export const PlatformDrawerContext = createContext<PlatformDrawerContextProps>({
  setDrawerVisible: () => {},
  drawerVisible: false,
});

export const Root: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerCtx = useMemo(
    () => ({
      drawerVisible,
      setDrawerVisible,
    }),
    [drawerVisible]
  );

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
          <ConfirmProvider>
            <PlatformDrawerContext.Provider value={drawerCtx}>
              <HashRouter>
                <Router />
              </HashRouter>
            </PlatformDrawerContext.Provider>
          </ConfirmProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </HelmetProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
