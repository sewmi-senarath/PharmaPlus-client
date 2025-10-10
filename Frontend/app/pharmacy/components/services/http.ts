let authToken: string | null = null;
export const setAuthToken = (t?: string) => (authToken = t ?? null);

/** Low-level HTTP with JSON + helpful errors */
export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const base = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';
  const url = `${base}${path}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    let text = '';
    try { text = await res.text(); } catch {}
    throw new Error(`HTTP ${res.status} ${url}\n${text}`);
  }
  if (res.status === 204) return null as T;
  return (await res.json()) as T;
}