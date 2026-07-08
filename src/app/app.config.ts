import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SOURCE_INGESTION_PORT } from './source-ingestion/infrastructure/tokens/source-ingestion-port.token';
import { FakeSourceIngestionAdapter } from './source-ingestion/infrastructure/adapters/FakeSourceIngestionAdapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    { provide: SOURCE_INGESTION_PORT, useClass: FakeSourceIngestionAdapter },
  ],
};
