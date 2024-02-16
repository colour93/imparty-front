import React from "react";
import { Routes, Route } from "react-router-dom";
import { OverviewPage } from "../pages/Overview";
import { PlatformPage } from "../pages/Platform";
import { InvitePage } from "../pages/Invite";
import { JoinPage } from "../pages/Join";
import { AuthPage } from "../pages/Auth/indexs";
import App from "../App";

export const Router: React.FC = () => {
  const auth = true;

  return (
    <Routes>
      <Route path="/" Component={App}>
        <Route path="/auth" Component={AuthPage} />

        {/* 鉴权路由 */}
        {auth && (
          <>
            <Route path="/" Component={OverviewPage} />
            <Route path="/p/:pid" Component={PlatformPage} />
            <Route path="/p/:pid/invite" Component={InvitePage} />
            <Route path="/join/:code" Component={JoinPage} />
          </>
        )}
      </Route>
    </Routes>
  );
};
