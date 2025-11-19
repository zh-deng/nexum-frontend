import { QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (error && typeof error === "object") {
        const err = error as { statusCode?: number; message?: string };

        if (err.statusCode === 401 || err.message === "Unauthorized") {
          window.location.href = "/login";
        }
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});
