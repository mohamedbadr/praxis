import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data.expectedRoles;
    const userRoles = this.authService.getUserRoles();

    const commonValues = userRoles.filter(function (value) {
      return expectedRoles.indexOf(value) > -1;
    });

    if (commonValues.length > 0) {
      return true;
    } else {
      this.router.navigate(['/not-authenticated']);
      return false;
    }
  }
}
