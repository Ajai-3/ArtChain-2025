import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryProvider } from "./api/providers/QueryClient.tsx";
import App from "./App.tsx";
import { store } from "./redux/store.ts";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import "./index.css";
import { SocketProvider } from "./components/socket/SocketProvider.tsx";
import { AuthInitializer } from "./components/auth/AuthInitializer.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ErrorBoundary>
      <QueryProvider>
        <Provider store={store}>
          <AuthInitializer>
            <SocketProvider>
              <ThemeProvider>
                <App />
                {import.meta.env.DEV && (
                  <ReactQueryDevtools
                    initialIsOpen={false}
                    buttonPosition="top-left"
                    position="left"
                  />
                )}
              </ThemeProvider>
            </SocketProvider>
          </AuthInitializer>
        </Provider>
      </QueryProvider>
    </ErrorBoundary>
  </BrowserRouter>
);

