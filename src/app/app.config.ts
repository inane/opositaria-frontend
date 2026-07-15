import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { SOURCE_INGESTION_PORT } from './source-ingestion/infrastructure/tokens/source-ingestion-port.token';
import { FakeSourceIngestionAdapter } from './source-ingestion/infrastructure/adapters/FakeSourceIngestionAdapter';
import { AuthGuard } from './auth/infrastructure/adapters/AuthGuard';
import { AuthInterceptor } from './auth/infrastructure/adapters/AuthInterceptor';
import { TokenStorageService } from './auth/infrastructure/adapters/TokenStorageService';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideNoopAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    { provide: SOURCE_INGESTION_PORT, useClass: FakeSourceIngestionAdapter },
    AuthGuard,
    TokenStorageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
};
