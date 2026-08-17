
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const TOKEN_KEY = "zamtrix_token";
const USER_KEY = "zamtrix_user";

/* ----------------------------- Token storage ----------------------------- */

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/* --------------------------------- Types --------------------------------- */

export interface AuthUser {
  id?: number;
  email: string;
  name?: string;
  role: string;
  business?: string;
  industry?: string;
  businessId?: number;
  branchId?: number | null;
}

export interface ApiError {
  error: string;
  details?: string;
  message?: string;
  [key: string]: unknown;
}

/* ------------------------------- Core fetch ------------------------------- */

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  /** Skip auth header (e.g. for /login) */
  noAuth?: boolean;
  /** Return raw Response (for file downloads) */
  raw?: boolean;
  signal?: AbortSignal;
}

function buildUrl(
  path: string,
  params?: RequestOptions["params"]
): string {
  const url = new URL(
    path.startsWith("http") ? path : `${API_BASE_URL}${path}`
  );
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }
  return url.toString();
}

export async function apiRequest<T = unknown>(
  path: string,
  opts: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    headers = {},
    noAuth = false,
    raw = false,
    signal,
  } = opts;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (!noAuth) {
    const token = getToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(buildUrl(path, params), {
    method,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
    signal,
  });

  if (raw) return res as unknown as T;

  // 401 → clear token so auth provider can re-login
  if (res.status === 401) {
    clearToken();
  }

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    let err: ApiError;
    if (contentType.includes("application/json")) {
      err = (await res.json()) as ApiError;
    } else {
      err = { error: await res.text() };
    }
    throw new ApiErrorImpl(err.error || `Request failed: ${res.status}`, res.status, err);
  }

  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  // Non-JSON success (e.g. 204 No Content)
  return undefined as unknown as T;
}

/* --------------------------- Error implementation --------------------------- */

export class ApiErrorImpl extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiErrorImpl";
    this.status = status;
    this.details = details;
  }
}

/* ------------------------------ Convenience ------------------------------ */

export const api = {
  get: <T = unknown>(path: string, params?: RequestOptions["params"], opts?: Omit<RequestOptions, "method" | "params">) =>
    apiRequest<T>(path, { ...opts, method: "GET", params }),
  post: <T = unknown>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...opts, method: "POST", body }),
  put: <T = unknown>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...opts, method: "PUT", body }),
  patch: <T = unknown>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T = unknown>(path: string, opts?: Omit<RequestOptions, "method">) =>
    apiRequest<T>(path, { ...opts, method: "DELETE" }),
  raw: (path: string, opts?: RequestOptions) => apiRequest<Response>(path, { ...opts, raw: true }),
};

/* ------------------------------ Auth helpers ------------------------------ */

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ message: string; token: string; role: string }>("/api/auth/login", { email, password }, { noAuth: true }),
  register: (payload: { email: string; password: string; business: string; industry: string }) =>
    api.post<{ message: string; userId: number }>("/api/auth/register", payload, { noAuth: true }),
  switchBranch: (branchId: number) =>
    api.post<{ message: string; branchId: number; branchName: string }>("/api/auth/switch-branch", { branchId }),
};
