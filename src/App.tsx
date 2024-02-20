import { useMemo } from "react";
import { HomeWrapper } from "./components/layout/wrapper/home";
import { Outlet, useLocation } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { SWRConfig } from "swr";
import { PlatformDrawer } from "./components/layout/PlatformDrawer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

const App: React.FC = () => {
  const location = useLocation();

  const isAuth = useMemo(
    () => location.pathname.toLowerCase() === "/auth",
    [location.pathname]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="flex" id="app">
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={3000}
        />
        <SWRConfig
          value={{
            onError: (err) => {
              enqueueSnackbar("网络请求错误，详情请见控制台输出", {
                variant: "error",
              });
              console.error(err);
              throw err;
            },
          }}
        >
          {isAuth ? (
            <Outlet />
          ) : (
            <>
              <PlatformDrawer />
              <HomeWrapper>
                <Outlet />
              </HomeWrapper>
            </>
          )}
        </SWRConfig>
      </div>
    </LocalizationProvider>
  );
};

export default App;
