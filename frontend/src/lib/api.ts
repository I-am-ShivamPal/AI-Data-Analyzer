export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  data: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(status: number, message: string, data?: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

/**
 * Core fetch wrapper that automatically includes credentials (for HttpOnly cookies).
 */
export async function apiRequest<T = any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // CRITICAL for session-based auth
  };

  try {
    const response = await fetch(url, config);

    // If it's a 204 No Content, return null
    if (response.status === 204) {
      return null as T;
    }

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle known error structures from FastAPI
      const errorMessage = data?.detail || data?.message || response.statusText;
      throw new ApiError(response.status, errorMessage, data);
    }

    return data as T;
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or parsing errors
    throw new Error(error instanceof Error ? error.message : "An unexpected error occurred");
  }
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => apiRequest<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, options?: RequestInit) => apiRequest<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, options?: RequestInit) => apiRequest<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) => apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
