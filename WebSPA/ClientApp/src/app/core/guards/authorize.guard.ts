import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivate {
  constructor(private router: Router, private jwtService: JwtHelperService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = AuthService.getToken();
    if (token == null) {
      return false;
    }

    if (this.jwtService.isTokenExpired(token)) {
      return false;
    }

    return true;
  }
}
