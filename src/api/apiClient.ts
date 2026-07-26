/**
 * apiClient.ts - Typed API Client with JWT authorization header interceptor.
 */

import { getItem } from "../utils/storage";

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiClient<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const token = getItem<string | null>("jwt_token", null);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
  }

  return response.json() as Promise<T>;
}
