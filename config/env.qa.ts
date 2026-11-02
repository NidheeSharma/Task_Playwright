import type { EnvConfig } from './types';

/**
 * Default QA profile for automationexercise.com (public practice site).
 */
export const env: EnvConfig = {
  name: 'qa',
  baseURL: 'https://www.automationexercise.com',
  apiURL: 'https://www.automationexercise.com/api',
  timeout: 30_000,
};
