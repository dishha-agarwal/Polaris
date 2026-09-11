// src/lib/api.ts
// Centralized API configuration

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export function getApiUrl(endpoint: string): string {
  // Ensure the endpoint starts with a slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Strip trailing slash from base URL
  const cleanBase = API_BASE_URL.replace(/\/$/, '');
  
  return `${cleanBase}${cleanEndpoint}`;
}
