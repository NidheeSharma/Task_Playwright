import type { EnvConfig } from './types';

/**
 * Prod-shaped profile. Same public host for this practice site; timeouts
 * stay conservative for CI.
 */
export const env: EnvConfig = {
  name: 'prod',
  baseURL: 'https://www.automationexercise.com',
  apiURL: 'https://www.automationexercise.com/api',
  timeout: 30_000,
};
