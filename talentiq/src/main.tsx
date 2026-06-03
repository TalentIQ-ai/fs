import ReactDOM from "react-dom/client";

import "./index.css";

import QueryProvider from "./provider/query-provider";
import LayoutConfigProvider from "./provider/theme-config-provider";
import Routes from "./routes";

import { ToasterConfig } from "@/components";

import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <LayoutConfigProvider>
    <QueryProvider>
      <HelmetProvider>
        <ToasterConfig />
        <Routes />
      </HelmetProvider>
    </QueryProvider>
  </LayoutConfigProvider>
);