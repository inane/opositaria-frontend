import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthError } from '../../domain/entities/AuthError';
import { AuthToken } from '../../domain/entities/AuthToken';
import { AuthRepository } from '../../domain/repositories/AuthRepository';

const LOGIN_ENDPOINT = '/auth/login';

@Injectable({ providedIn: 'root' })
export class HttpAuthAdapter implements AuthRepository {
  constructor(private readonly http: HttpClient) {}

  async login(credentials: { email: string; password: string }): Promise<AuthToken> {
    let response: { access_token: string; token_type: string };

    try {
      response = await firstValueFrom(
        this.http.post<{ access_token: string; token_type: string }>(LOGIN_ENDPOINT, credentials),
      );
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        throw AuthError.createUnauthorized('Invalid credentials');
      }

      throw AuthError.create('Login service unavailable');
    }

    try {
      return AuthToken.create({ accessToken: response.access_token, tokenType: response.token_type });
    } catch {
      throw AuthError.create('Invalid login response');
    }
  }
}
