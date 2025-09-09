import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BoardProvider } from "./context/BoardContext.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoardProvider>
      <App />
    </BoardProvider>
  </StrictMode>
);
