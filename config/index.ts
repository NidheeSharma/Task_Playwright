import dotenv from 'dotenv';
import path from 'node:path';
import { env as dev } from './env.dev';
import { env as qa } from './env.qa';
import { env as prod } from './env.prod';
import type { EnvConfig, EnvironmentName } from './types';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const registry: Record<EnvironmentName, EnvConfig> = { dev, qa, prod };

function isEnvironmentName(value: string): value is EnvironmentName {
  return Object.prototype.hasOwnProperty.call(registry, value);
}

const selected = process.env.ENV ?? 'qa';

if (!isEnvironmentName(selected)) {
  const allowed = Object.keys(registry).join(', ');
  throw new Error(`Unknown ENV "${selected}". Use one of: ${allowed}`);
}

export const env: EnvConfig = registry[selected];
export type { EnvConfig, EnvironmentName };
