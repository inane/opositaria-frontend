import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { LoginStore } from '../store/login-store.service';

describe('The LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigateByUrl: vi.fn().mockResolvedValue(true) };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NoopAnimationsModule],
      providers: [{ provide: Router, useValue: router }],
    });
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders a USUARIO field, a PASSWORD field, a Recordar password checkbox, and a login button', () => {
    const el = fixture.nativeElement;

    expect(el.querySelector('[name="email"]')).toBeTruthy();
    expect(el.querySelector('[type="password"]')).toBeTruthy();
    expect(el.querySelector('[type="checkbox"]')).toBeTruthy();
    expect(el.querySelector('button')?.textContent?.toLowerCase()).toContain('iniciar');
  });

  it('navigates to the dashboard after successful login', async () => {
    const store = fixture.debugElement.injector.get(LoginStore);
    store.setEmail('user@example.com');
    store.setPassword('secret123');

    const loginPromise = (fixture.componentInstance as unknown as { login: () => Promise<void> }).login();
    const req = httpMock.expectOne('/auth/login');
    req.flush({ access_token: 'abc123', token_type: 'bearer' });
    await loginPromise;

    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
