export type EnvironmentName = 'dev' | 'qa' | 'prod';

export interface EnvConfig {
  name: EnvironmentName;
  baseURL: string;
  apiURL: string;
  timeout: number;
}
