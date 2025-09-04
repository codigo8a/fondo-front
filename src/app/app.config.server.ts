import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideZonelessChangeDetection } from '@angular/core';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideZonelessChangeDetection()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
