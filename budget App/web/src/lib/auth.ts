'use client';

/**
 * Auth helpers — JWT persistence + React context.
 *
 * Access token is kept in localStorage for simplicity in the web/PWA tier.
 * In the native Capacitor shell the @capacitor/preferences plugin should
 * replace localStorage for encrypted storage on-device (see ROADMAP).
 */

const ACCESS_TOKEN_KEY = 'bl_access_token';

export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

export function clearToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
