/**
 * apiClient.ts - Production-grade Typed API Client with interceptors, timeout,
 * automatic retry logic, query parameter building, and structured ApiError handling.
 */

import { getItem } from "../utils/storage";

export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public details?: unknown;
  public timestamp: string;

  constructor(status: number, statusText: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Restore prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp: string;
}

export interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Builds a full URL with serialized query parameters.
 */
export function buildUrlWithParams(
  baseUrl: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return baseUrl;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  if (!queryString) return baseUrl;
  return baseUrl.includes("?") ? `${baseUrl}&${queryString}` : `${baseUrl}?${queryString}`;
}

/**
 * Core generic API fetch function with timeout and retry handling.
 */
export async function apiClient<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    params,
    timeoutMs = 10000,
    retries = 0,
    retryDelayMs = 500,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const fullUrl = buildUrlWithParams(url, params);
  const token = getItem<string | null>("jwt_token", null);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: unknown = null;
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;

        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            errorData = await response.json();
            if (typeof errorData === "object" && errorData !== null) {
              const obj = errorData as Record<string, unknown>;
              if (typeof obj.message === "string") {
                errorMessage = obj.message;
              }
            }
          } else {
            const rawText = await response.text();
            if (rawText) errorMessage = rawText;
          }
        } catch {
          // Ignore JSON parse errors for error response
        }

        const apiErr = new ApiError(response.status, response.statusText, errorMessage, errorData);

        // Retry on server side errors (5xx) if retries > 0
        if (response.status >= 500 && attempt < retries) {
          attempt++;
          await new Promise((res) => setTimeout(res, retryDelayMs * Math.pow(2, attempt - 1)));
          continue;
        }

        throw apiErr;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof ApiError) {
        throw err;
      }

      const isAbort = (err as Error).name === "AbortError";
      const message = isAbort
        ? `Request timed out after ${timeoutMs}ms`
        : (err as Error).message || "Network request failed";

      lastError = new ApiError(isAbort ? 408 : 0, isAbort ? "Timeout" : "NetworkError", message);

      if (attempt < retries && !isAbort) {
        attempt++;
        await new Promise((res) => setTimeout(res, retryDelayMs * Math.pow(2, attempt - 1)));
      } else {
        throw lastError;
      }
    }
  }

  throw lastError || new ApiError(500, "UnknownError", "Request execution failed");
}

/**
 * Convenience HTTP method wrappers.
 */
apiClient.get = <T>(
  url: string,
  params?: Record<string, string | number | boolean | undefined | null>,
  options?: RequestOptions
): Promise<T> => apiClient<T>(url, { ...options, method: "GET", params });

apiClient.post = <T>(
  url: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> =>
  apiClient<T>(url, {
    ...options,
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

apiClient.put = <T>(
  url: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> =>
  apiClient<T>(url, {
    ...options,
    method: "PUT",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

apiClient.patch = <T>(
  url: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> =>
  apiClient<T>(url, {
    ...options,
    method: "PATCH",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

apiClient.delete = <T>(url: string, options?: RequestOptions): Promise<T> =>
  apiClient<T>(url, { ...options, method: "DELETE" });
