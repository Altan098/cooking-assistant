const API_URL = '/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Что-то пошло не так. Попробуйте ещё раз';
}

interface TokenPayload {
  access_token: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

// Access token живёт только в памяти: скрипты не найдут его в localStorage,
// а после перезагрузки страницы он восстанавливается по refresh-cookie.
let accessToken: string | null = null;
let refreshPromise: Promise<TokenPayload> | null = null;
let sessionExpiredHandler: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function setSessionExpiredHandler(handler: (() => void) | null) {
  sessionExpiredHandler = handler;
}

async function send(path: string, { method = 'GET', body }: RequestOptions) {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  try {
    return await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Сервер недоступен. Проверьте подключение.');
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  if (response.status >= 500) {
    return new ApiError(response.status, 'Ошибка сервера. Попробуйте позже.');
  }
  if (response.status === 422) {
    return new ApiError(422, 'Проверьте правильность заполнения полей');
  }
  const data = await response.json().catch(() => null);
  const detail = typeof data?.detail === 'string' ? data.detail : 'Не удалось выполнить запрос';
  return new ApiError(response.status, detail);
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

/**
 * Обменивает refresh-cookie на новый access token. Токен одноразовый, поэтому
 * параллельные вызовы (несколько запросов с 401, StrictMode) делят один запрос.
 */
export function refreshSession<T extends TokenPayload = TokenPayload>(): Promise<T> {
  refreshPromise ??= send('/auth/refresh', { method: 'POST' })
    .then((response) => parse<TokenPayload>(response))
    .then((payload) => {
      accessToken = payload.access_token;
      return payload;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise as Promise<T>;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(path, options);
  if (response.status !== 401 || path.startsWith('/auth/')) {
    return parse<T>(response);
  }

  try {
    await refreshSession();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      accessToken = null;
      sessionExpiredHandler?.();
    }
    throw error;
  }
  return parse<T>(await send(path, options));
}
