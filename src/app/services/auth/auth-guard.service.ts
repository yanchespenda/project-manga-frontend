import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
        return true;
    }
    const curentUrl = state.url;
    if (curentUrl === '/') {
      this.router.navigate(['oauth/signin']);
    } else {
      this.router.navigate(['oauth/signin'], { queryParams: { next: state.url }});
    }
    return false;
  }
}
