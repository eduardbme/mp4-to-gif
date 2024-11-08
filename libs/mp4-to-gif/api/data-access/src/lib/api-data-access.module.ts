import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './+state/interceptors';
import { ApiService } from './+state/services';
import { API_CONFIG_TOKEN, ApiConfig } from './providers';

@NgModule({
  imports: [CommonModule],
  providers: [ApiService],
})
export class ApiDataAccessModule {
  static forRoot(config: ApiConfig): ModuleWithProviders<ApiDataAccessModule> {
    return {
      ngModule: ApiDataAccessModule,
      providers: [
        {
          provide: API_CONFIG_TOKEN,
          useValue: config,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true,
        },
      ],
    };
  }
}
