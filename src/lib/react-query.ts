import { QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (error && typeof error === "object") {
        const err = error as { statusCode?: number; message?: string };

        // Only redirect to login if we're not already there (prevent loops)
        if (
          (err.statusCode === 401 || err.message === "Unauthorized") &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
