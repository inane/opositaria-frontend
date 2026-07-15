import { signal } from '@angular/core';
import { LoginUseCase } from '../../application/LoginUseCase';
import { AuthError } from '../../domain/entities/AuthError';

export class LoginStore {
  private readonly emailSignal = signal('');
  private readonly passwordSignal = signal('');
  private readonly rememberSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);

  readonly email = this.emailSignal.asReadonly();
  readonly password = this.passwordSignal.asReadonly();
  readonly remember = this.rememberSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();

  constructor(private readonly loginUseCase: LoginUseCase) {}

  setEmail(value: string): void {
    this.emailSignal.set(value);
    this.errorSignal.set(null);
  }

  setPassword(value: string): void {
    this.passwordSignal.set(value);
    this.errorSignal.set(null);
  }

  toggleRemember(): void {
    this.rememberSignal.update((v) => !v);
  }

  setRemember(value: boolean): void {
    this.rememberSignal.set(value);
  }

  async login(): Promise<boolean> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      await this.loginUseCase.execute({
        email: this.emailSignal(),
        password: this.passwordSignal(),
        remember: this.rememberSignal(),
      });

      this.errorSignal.set(null);
      return true;
    } catch (error: unknown) {
      this.errorSignal.set(error instanceof AuthError ? error.message : 'Invalid credentials');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
