/**
 * Typed fetch wrapper for the BudgetLens /api/v1 backend.
 *
 * All requests automatically attach the stored JWT access token.
 * API_URL is injected at build time via the NEXT_PUBLIC_API_URL env variable.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('bl_access_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers ?? {}),
  };

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, message);
  }

  // 204 No Content — return void
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export const authApi = {
  login(email: string, password: string): Promise<LoginResponse> {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  register(email: string, password: string, name: string): Promise<{ id: string }> {
    return request<{ id: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },
  refresh(refreshToken?: string): Promise<LoginResponse> {
    const token =
      refreshToken ??
      (typeof window !== 'undefined'
        ? localStorage.getItem('bl_refresh_token')
        : null);
    return request<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: token }),
    });
  },
};

// ── Receipts ──────────────────────────────────────────────────────────────────

export interface Receipt {
  id: string;
  status: string;
  merchantName?: string;
  totalAmount?: { amount: string; currency: string };
  issuedAt?: string;
  categoryId?: string;
}

export const receiptsApi = {
  list(): Promise<Receipt[]> {
    return request<Receipt[]>('/receipts');
  },
  get(id: string): Promise<Receipt> {
    return request<Receipt>(`/receipts/${id}`);
  },
  upload(formData: FormData): Promise<Receipt> {
    // Content-Type must be omitted so the browser sets it with the boundary
    return request<Receipt>('/receipts', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  },
  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return request<{ id: string; deleted: boolean }>(`/receipts/${id}`, {
      method: 'DELETE',
    });
  },
  getStatus(id: string): Promise<{ id: string; status: string }> {
    return request<{ id: string; status: string }>(`/receipts/${id}/status`);
  },
};

// ── Categories ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  type: 'USER_DEFINED' | 'SYSTEM';
}

export const categoriesApi = {
  list(): Promise<Category[]> {
    return request<Category[]>('/categories');
  },
  create(name: string): Promise<Category> {
    return request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
};
