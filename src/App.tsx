import { useMemo } from "react";
import { HomeWrapper } from "./components/layout/wrapper/home";
import { Outlet } from "react-router-dom";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { SWRConfig } from "swr";

const App: React.FC = () => {
  const isAuth = useMemo(
    () => location.pathname.toLowerCase() === "/auth",
    [location.pathname]
  );

  return (
    <>
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
          <HomeWrapper>
            <Outlet />
          </HomeWrapper>
        )}
      </SWRConfig>
    </>
  );
};

export default App;
