import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React from "react";
import ReactDOM from "react-dom/client";
import superjson from "superjson";
import App from "./App.tsx";
import { MockDataProvider } from "./context/MockDataContext.tsx";
import "./index.css";
import { trpc } from "./lib/trpc";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
});

// LifeLink is intentionally light-only: discard legacy preferences before rendering.
document.documentElement.setAttribute('data-theme', 'light');
localStorage.removeItem('lifelink_theme');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MockDataProvider>
          <App />
        </MockDataProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);
