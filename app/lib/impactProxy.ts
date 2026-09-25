/**
 * Server-side helpers for the /api/impact proxy.
 *
 * The proxy only forwards to a fixed set of read-only worker endpoints. The
 * `endpoint` query value must equal one of them exactly, so absolute URLs,
 * protocol-relative '//host', backslashes, dot segments and encoded variants
 * are all rejected by construction.
 */

export const DEFAULT_IMPACT_API_BASE_URL = 'https://api.0impact.ai';

export const ALLOWED_ENDPOINTS = [
  '/status',
  '/transactions',
  '/certificates',
  '/certificate',
  '/daily-summary',
  '/consumption',
  '/health',
] as const;

export type ImpactEndpoint = (typeof ALLOWED_ENDPOINTS)[number];

/** Returns the endpoint when it is allow-listed, otherwise null. */
export function resolveEndpoint(endpoint: string | null | undefined): ImpactEndpoint | null {
  if (typeof endpoint !== 'string') return null;
  return (ALLOWED_ENDPOINTS as readonly string[]).includes(endpoint) ? (endpoint as ImpactEndpoint) : null;
}

/**
 * Upstream base URL. `IMPACT_API_BASE_URL` (server-side only) points the site at
 * another worker, e.g. http://localhost:8787 for local testing. Returns null for a
 * value that is not a plain http(s) URL, so a bad setting fails loudly.
 */
export function resolveApiBase(envValue: string | null | undefined): string | null {
  const value = (envValue ?? '').trim() || DEFAULT_IMPACT_API_BASE_URL;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.username || url.password || url.search || url.hash) return null;
  return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
}

/** Full upstream URL for an allow-listed endpoint, carrying every query param except `endpoint`. */
export function buildUpstreamUrl(base: string, endpoint: ImpactEndpoint, params: URLSearchParams): URL {
  const url = new URL(`${base}${endpoint}`);
  params.forEach((value, key) => {
    if (key !== 'endpoint') url.searchParams.set(key, value);
  });
  return url;
}
