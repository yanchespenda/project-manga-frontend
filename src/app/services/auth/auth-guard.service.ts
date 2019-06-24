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
    const curent_url = state.url;
    if (curent_url === '/') {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login'], { queryParams: { next: state.url }});
    }
    return false;
  }
}
