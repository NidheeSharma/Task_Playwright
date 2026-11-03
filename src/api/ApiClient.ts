import type { APIRequestContext, APIResponse } from '@playwright/test';
import { API_PREFIX } from '../data/constants';
import { logger } from '../utils/logger';
import type { ApiResult } from './types';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Form = Record<string, string>;
type SendOptions = { form?: Form | undefined; params?: Form | undefined };
type FetchOptions = NonNullable<Parameters<APIRequestContext['fetch']>[1]>;

const TRANSIENT_STATUS = new Set([502, 503, 504]);
const MAX_ATTEMPTS = 3;
/** The shared site can take a long time under parallel load; do not inherit the 15s action timeout. */
const REQUEST_TIMEOUT_MS = 45_000;
/** Read-only endpoints that are safe to retry; create/delete are never retried here. */
const SAFE_TO_RETRY = new Set(['verifyLogin', 'searchProduct']);

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Thin wrapper over APIRequestContext.
 * The site often answers HTTP 200 and puts the real status in the body `responseCode`,
 * and may label JSON as text/html, so the body is read as text and parsed manually.
 */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async send<T = Record<string, unknown>>(
    method: Method,
    endpoint: string,
    options: SendOptions = {},
  ): Promise<ApiResult<T>> {
    const url = `${API_PREFIX}/${endpoint}`;
    const requestOptions: FetchOptions = { method, timeout: REQUEST_TIMEOUT_MS };
    if (options.form) requestOptions.form = options.form;
    if (options.params) requestOptions.params = options.params;

    const retryable = method === 'GET' || SAFE_TO_RETRY.has(endpoint);
    const response = await this.fetchWithRetry(url, requestOptions, retryable, `${method} ${endpoint}`);

    const text = await response.text();
    let body: Record<string, unknown> = {};
    try {
      body = JSON.parse(text) as Record<string, unknown>;
    } catch {
      logger.warn(`Non-JSON response from ${method} ${endpoint}`, { status: response.status() });
    }
    const responseCode = typeof body.responseCode === 'number' ? body.responseCode : response.status();
    const message = typeof body.message === 'string' ? body.message : undefined;
    logger.info(`${method} ${endpoint}`, { httpStatus: response.status(), responseCode, form: options.form });
    const result: ApiResult<T> = { httpStatus: response.status(), responseCode, data: body as T };
    if (message !== undefined) result.message = message;
    return result;
  }

  /** Retries timeouts and 502/503/504, but only for calls that are safe to repeat. */
  private async fetchWithRetry(
    url: string,
    requestOptions: FetchOptions,
    retryable: boolean,
    label: string,
  ): Promise<APIResponse> {
    const attempts = retryable ? MAX_ATTEMPTS : 1;
    for (let attempt = 1; ; attempt++) {
      try {
        const response = await this.request.fetch(url, requestOptions);
        if (attempt >= attempts || !TRANSIENT_STATUS.has(response.status())) return response;
        logger.warn(`Transient ${response.status()} from ${label}, retry ${attempt}`);
      } catch (error) {
        if (attempt >= attempts) throw error;
        logger.warn(`Request error from ${label}, retry ${attempt}`, { error: String(error) });
      }
      await sleep(1000 * attempt);
    }
  }

  get<T = Record<string, unknown>>(endpoint: string, params?: Form): Promise<ApiResult<T>> {
    return this.send<T>('GET', endpoint, { params });
  }
  post<T = Record<string, unknown>>(endpoint: string, form?: Form): Promise<ApiResult<T>> {
    return this.send<T>('POST', endpoint, { form });
  }
  put<T = Record<string, unknown>>(endpoint: string, form?: Form): Promise<ApiResult<T>> {
    return this.send<T>('PUT', endpoint, { form });
  }
  delete<T = Record<string, unknown>>(endpoint: string, form?: Form): Promise<ApiResult<T>> {
    return this.send<T>('DELETE', endpoint, { form });
  }
}
