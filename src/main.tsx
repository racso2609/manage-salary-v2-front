import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthProvider from "./context/AuthContext.tsx";
import "normalize.css";
import { BrowserRouter } from "react-router";
import { SWRConfig } from "swr";

createRoot(document.getElementById("root")!).render(
  <SWRConfig>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </SWRConfig>,
);
