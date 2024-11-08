import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ApiDataAccessModule } from '@mp4-to-gif/api/data-access';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideStore({}),
    provideStoreDevtools({}),
    provideEffects([]),
    importProvidersFrom(
      ApiDataAccessModule.forRoot({
        serverUrl: 'http://localhost:5000',
      })
    ),
  ],
};
