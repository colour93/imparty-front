import ReactDOM from "react-dom/client";
import "./index.css";
import { Router } from "./router/index.tsx";
import { HashRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <HashRouter>
      <Router />
    </HashRouter>
  </HelmetProvider>
);
