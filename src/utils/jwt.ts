/**
 * jwt.ts - Generic typed JWT encoding, decoding, and expiration helper.
 *
 * Uses base64 encoding/decoding to simulate signed JWT tokens for client-side lab testing.
 */

import { DecodedToken, User } from "../types/auth";

/**
 * Base64 URL safe string encoder.
 */
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

/**
 * Base64 URL safe string decoder.
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

/**
 * Generates a mock JWT token string for a user with a given expiration duration in seconds.
 */
export function generateMockJwtToken(user: User, expiresInSeconds: number = 3600): string {
  const header = { alg: "HS256", typ: "JWT" };
  const nowInSeconds = Math.floor(Date.now() / 1000);

  const payload: DecodedToken = {
    sub: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: nowInSeconds,
    exp: nowInSeconds + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const mockSignature = base64UrlEncode(`mock-signature-${user.id}-${nowInSeconds}`);

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
}

/**
 * Generic helper to decode JWT payload safely.
 * decodeToken<DecodedToken>(token: string)
 */
export function decodeToken<T = DecodedToken>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson) as T;
    return payload;
  } catch (err) {
    console.error("[jwt] Error decoding token:", err);
    return null;
  }
}

/**
 * Checks if a decoded JWT token is expired.
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken<DecodedToken>(token);
  if (!decoded || !decoded.exp) return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp <= nowInSeconds;
}
