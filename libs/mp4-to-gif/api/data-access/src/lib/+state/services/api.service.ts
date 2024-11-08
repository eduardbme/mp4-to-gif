import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ApiError, ApiOk } from '@mp4-to-gif/api/domain';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_CONFIG_TOKEN, ApiConfig } from '../../providers';

@Injectable()
export class ApiService {
  constructor(
    private readonly _httpClient: HttpClient,
    @Inject(API_CONFIG_TOKEN) private readonly apiConfig: ApiConfig
  ) {}

  get<T>(path: string, version: 'v1' = 'v1'): Observable<T> {
    const endpoint = this.getEndpointForVersion(version);

    const url = new URL(path, endpoint);

    return this._httpClient
      .get<ApiOk<T>>(url.href)
      .pipe(map(this.handleResponse), catchError(this.handleErrorResponse));
  }

  post<T, D = any>(path: string, data: D, version: 'v1' = 'v1'): Observable<T> {
    const endpoint = this.getEndpointForVersion(version);

    const url = new URL(path, endpoint);

    return this._httpClient
      .post<ApiOk<T>>(url.href, data)
      .pipe(map(this.handleResponse), catchError(this.handleErrorResponse));
  }

  private handleResponse<T>(response: ApiOk<T>): T {
    if (response.code !== 0) {
      throw new Error(
        `Invalid response: ${response.code}; ${JSON.stringify(
          response.payload
        )}`
      );
    }

    return response.payload;
  }

  private handleErrorResponse(response: HttpErrorResponse): Observable<never> {
    return throwError(() => response.error as ApiError);
  }

  private getEndpointForVersion(version: 'v1'): string {
    if (version === 'v1') {
      return new URL(`api/${version}`, this.apiConfig.serverUrl).href;
    }

    throw new Error('Incorrect API version');
  }
}
