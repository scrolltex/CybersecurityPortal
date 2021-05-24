import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivateChild,
  Data,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private jwtService: JwtHelperService, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.check(state, route.data);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.check(state, childRoute.parent?.data);
  }

  private check(state: RouterStateSnapshot, data?: Data): boolean | UrlTree {
    if (this.jwtService.isTokenExpired()) {
      this.authService.logout();
      const returnUrl = state.url;
      return this.router.createUrlTree(['/auth/login'], { queryParams: { returnUrl } });
    }

    if (data && data.expectedRole) {
      const hasRole = this.authService.hasRole(data.expectedRole);
      if (hasRole) {
        return true;
      } else {
        return this.router.createUrlTree(['/forbidden']);
      }
    }

    return true;
  }
}
