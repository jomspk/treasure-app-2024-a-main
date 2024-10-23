import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { auth } from "./auth";
import theme from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("root 要素が存在しません");
}

const root = ReactDOM.createRoot(rootElement);

onAuthStateChanged(auth, async (firebaseUser) => {
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <App firebaseUser={firebaseUser} />
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
});
