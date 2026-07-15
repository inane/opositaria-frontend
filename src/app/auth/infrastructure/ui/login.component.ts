import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginStore } from '../store/login-store.service';
import { LoginUseCase } from '../../application/LoginUseCase';
import { HttpAuthAdapter } from '../adapters/HttpAuthAdapter';
import { TokenStorageService } from '../adapters/TokenStorageService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatInputModule, MatCheckboxModule, FormsModule],
  providers: [
    HttpAuthAdapter,
    TokenStorageService,
    {
      provide: LoginUseCase,
      useFactory: (repository: HttpAuthAdapter, storage: TokenStorageService) =>
        new LoginUseCase(repository, storage),
      deps: [HttpAuthAdapter, TokenStorageService],
    },
    {
      provide: LoginStore,
      useFactory: (loginUseCase: LoginUseCase) => new LoginStore(loginUseCase),
      deps: [LoginUseCase],
    },
  ],
  template: `
    <div class="login-container">
      <form class="login-form" (ngSubmit)="login()" #loginForm="ngForm">
        <h1 class="login-title">Opositaria</h1>

        <mat-form-field appearance="fill" class="login-field">
          <mat-label>USUARIO</mat-label>
          <input
            matInput
            name="email"
            type="text"
            [(ngModel)]="emailValue"
            (ngModelChange)="store.setEmail($event)"
          />
        </mat-form-field>

        <mat-form-field appearance="fill" class="login-field">
          <mat-label>PASSWORD</mat-label>
          <input
            matInput
            name="password"
            type="password"
            [(ngModel)]="passwordValue"
            (ngModelChange)="store.setPassword($event)"
          />
        </mat-form-field>

        <mat-checkbox
          class="login-remember"
          [(ngModel)]="rememberValue"
          name="remember"
          (ngModelChange)="store.setRemember($event)"
        >
          Recordar password
        </mat-checkbox>

        @if (store.error(); as error) {
          <p role="alert" class="login-error">{{ error }}</p>
        }

        <button
          matButton="filled"
          color="primary"
          type="submit"
          class="login-button"
          [disabled]="store.isLoading()"
        >
          {{ store.isLoading() ? 'Iniciando sesión...' : 'Iniciar sesión' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--opo-color-page);
    }
    .login-container {
      width: 100%;
      max-width: 24rem;
      padding: 1rem;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      background: var(--opo-color-surface);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: var(--opo-shadow-sm);
    }
    .login-title {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 1.5rem;
    }
    .login-field {
      width: 100%;
      margin-bottom: 0.5rem;
    }
    .login-remember {
      margin: 0.5rem 0 1rem;
    }
    .login-error {
      color: var(--opo-color-danger);
      font-size: 0.875rem;
      margin: 0 0 0.75rem;
    }
    .login-button {
      width: 100%;
    }
  `],
})
export class LoginComponent {
  protected readonly store = inject(LoginStore);
  private readonly router = inject(Router);

  protected emailValue = '';
  protected passwordValue = '';
  protected rememberValue = false;

  protected async login(): Promise<void> {
    const didLogin = await this.store.login();

    if (didLogin) {
      await this.router.navigateByUrl('/dashboard');
    }
  }
}
