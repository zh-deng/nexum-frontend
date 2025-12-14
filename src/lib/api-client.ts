import { API_BASE } from "../utils/environment";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(
        error.message || `Request failed with status ${res.status}`,
      );
    }

    return (await res.json()) as T;
  } catch (error: unknown) {
    throw error;
  }
}
