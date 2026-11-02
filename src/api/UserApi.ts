import type { UserData } from '../data/factory';
import type { ApiClient } from './ApiClient';
import type { ApiResult, UserDetailBody } from './types';

export class UserApi {
  constructor(private readonly client: ApiClient) {}

  create(user: UserData): Promise<ApiResult> {
    return this.client.post('createAccount', { ...user });
  }

  delete(email: string, password: string): Promise<ApiResult> {
    return this.client.delete('deleteAccount', { email, password });
  }

  verifyLogin(email: string, password: string): Promise<ApiResult> {
    return this.client.post('verifyLogin', { email, password });
  }

  /** Sends only the given fields, for missing-parameter negative tests. */
  verifyLoginRaw(form: Record<string, string>): Promise<ApiResult> {
    return this.client.post('verifyLogin', form);
  }

  getByEmail(email: string): Promise<ApiResult<UserDetailBody>> {
    return this.client.get<UserDetailBody>('getUserDetailByEmail', { email });
  }

  /** Unsupported-method negative test (expects responseCode 405). */
  verifyLoginWithDelete(): Promise<ApiResult> {
    return this.client.delete('verifyLogin');
  }
}
