import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class UnAuthorizeGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const token = AuthService.getToken();
    if (token != null && token.length > 0) {
      return this.router.createUrlTree(['/']);
    }
    return true;
  }
}
