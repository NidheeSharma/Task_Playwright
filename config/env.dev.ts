import type { EnvConfig } from './types';

/**
 * Local/dev profile. Points at the public practice site until a dedicated
 * sandbox exists. Override via ENV=dev.
 */
export const env: EnvConfig = {
  name: 'dev',
  baseURL: 'https://www.automationexercise.com',
  apiURL: 'https://www.automationexercise.com/api',
  timeout: 45_000,
};
