import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenStorageService } from './TokenStorageService';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenStorage: TokenStorageService,
    private readonly router: Router,
  ) {}

  canActivate(): boolean | UrlTree {
    const token = this.tokenStorage.read();

    if (token) {
      return true;
    }

    return this.router.parseUrl('/login');
  }
}