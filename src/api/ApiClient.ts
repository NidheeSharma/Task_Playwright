import type { APIRequestContext } from '@playwright/test';
import { API_PREFIX } from '../data/constants';
import { logger } from '../utils/logger';
import type { ApiResult } from './types';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Form = Record<string, string>;
type SendOptions = { form?: Form | undefined; params?: Form | undefined };
type FetchOptions = NonNullable<Parameters<APIRequestContext['fetch']>[1]>;

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
    const requestOptions: FetchOptions = { method };
    if (options.form) requestOptions.form = options.form;
    if (options.params) requestOptions.params = options.params;
    const response = await this.request.fetch(url, requestOptions);
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