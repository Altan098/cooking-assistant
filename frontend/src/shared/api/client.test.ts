import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  api,
  ApiError,
  getErrorMessage,
  refreshSession,
  setAccessToken,
  setSessionExpiredHandler,
} from './client';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  setAccessToken(null);
  setSessionExpiredHandler(null);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api', () => {
  it('добавляет access token в заголовок', async () => {
    setAccessToken('token-1');
    fetchMock.mockResolvedValueOnce(json(200, { ok: true }));

    await api('/recipes/');

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.headers).toMatchObject({ Authorization: 'Bearer token-1' });
  });

  it('при 401 обновляет токен и повторяет запрос', async () => {
    setAccessToken('expired');
    fetchMock
      .mockResolvedValueOnce(json(401, { detail: 'expired' }))
      .mockResolvedValueOnce(json(200, { access_token: 'fresh' }))
      .mockResolvedValueOnce(json(200, { value: 1 }));

    await expect(api('/shopping-list/')).resolves.toEqual({ value: 1 });

    const retry = fetchMock.mock.calls[2][1] as RequestInit;
    expect(retry.headers).toMatchObject({ Authorization: 'Bearer fresh' });
  });

  it('несколько запросов с 401 делят одно обновление токена', async () => {
    fetchMock.mockImplementation(async (url, init) => {
      if (String(url).endsWith('/auth/refresh')) return json(200, { access_token: 'fresh' });
      const headers = (init?.headers ?? {}) as Record<string, string>;
      return headers.Authorization === 'Bearer fresh' ? json(200, {}) : json(401, {});
    });

    await Promise.all([api('/a'), api('/b'), api('/c')]);

    const refreshCalls = fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'));
    expect(refreshCalls).toHaveLength(1);
  });

  it('если обновить токен нельзя, завершает сессию', async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);
    fetchMock.mockResolvedValue(json(401, { detail: 'Сессия истекла, войдите снова' }));

    await expect(api('/shopping-list/')).rejects.toMatchObject({ status: 401 });

    expect(onExpired).toHaveBeenCalledOnce();
  });

  it('не завершает сессию из-за сбоя сети при обновлении', async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);
    fetchMock
      .mockResolvedValueOnce(json(401, {}))
      .mockRejectedValueOnce(new TypeError('network'));

    await expect(api('/shopping-list/')).rejects.toMatchObject({ status: 0 });

    expect(onExpired).not.toHaveBeenCalled();
  });

  it('ошибка неверного пароля не запускает обновление токена', async () => {
    fetchMock.mockResolvedValueOnce(json(401, { detail: 'Неверный email или пароль' }));

    await expect(api('/auth/login', { method: 'POST', body: {} })).rejects.toThrow(
      'Неверный email или пароль'
    );

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('возвращает undefined для ответа 204', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await expect(api('/recipes/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it.each([
    [500, {}, 'Ошибка сервера. Попробуйте позже.'],
    [422, { detail: [{ msg: 'field required' }] }, 'Проверьте правильность заполнения полей'],
    [403, { detail: 'Изменять рецепт может только его автор' }, 'Изменять рецепт может только его автор'],
    [404, {}, 'Не удалось выполнить запрос'],
  ])('переводит статус %i в понятное сообщение', async (status, body, message) => {
    fetchMock.mockResolvedValueOnce(json(status, body));
    await expect(api('/recipes/1')).rejects.toThrow(message);
  });

  it('сообщает о недоступном сервере', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('network'));
    await expect(api('/recipes/')).rejects.toMatchObject({ status: 0 });
  });
});

describe('refreshSession', () => {
  it('параллельные вызовы делают один запрос', async () => {
    fetchMock.mockResolvedValue(json(200, { access_token: 'fresh' }));

    await Promise.all([refreshSession(), refreshSession()]);

    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

describe('getErrorMessage', () => {
  it('берёт текст ошибки', () => {
    expect(getErrorMessage(new ApiError(403, 'Нет доступа'))).toBe('Нет доступа');
  });

  it('не показывает пользователю внутренние ошибки', () => {
    const fallback = 'Что-то пошло не так. Попробуйте ещё раз';
    expect(getErrorMessage('boom')).toBe(fallback);
    expect(getErrorMessage(new TypeError("Cannot read properties of undefined"))).toBe(fallback);
  });
});
