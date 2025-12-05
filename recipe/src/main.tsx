import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./global.css";

/**
 * Application Entry Point
 * 
 * Sets up:
 * - React Query with infinite cache strategy
 * - Toast notifications (Sonner)
 * - Global CSS (Tailwind + custom styles)
 */

/**
 * React Query Client Configuration
 * 
 * Production-ready setup with:
 * - Infinite cache (staleTime: Infinity) until manually invalidated
 * - Refetch on mount when stale (refetchOnMount: true)
 * - Optimized retry and garbage collection settings
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Cache forever until invalidated
      gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour after unmount
      retry: 1, // Retry once on failure
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: false, // Don't refetch on reconnect
      refetchOnMount: true, // Refetch if data is stale (after invalidation)
      placeholderData: (previousData: unknown) => previousData, // Use cached data as placeholder
    },
    mutations: {
      retry: 0, // Don't retry mutations (user should retry manually)
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
);
