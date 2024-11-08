import { InjectionToken } from '@angular/core';

export interface ApiConfig {
  serverUrl: string;
}

export const API_CONFIG_TOKEN = new InjectionToken<ApiConfig>(
  'API_CONFIG_TOKEN'
);
