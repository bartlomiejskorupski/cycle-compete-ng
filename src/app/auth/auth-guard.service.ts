import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, take } from "rxjs";
import { UserDataService } from "../shared/service/user-data.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private userData: UserDataService, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    this.userData.authenticated$
      .pipe(take(1))
      .subscribe({
        next: authenticated => {
          if(!authenticated) {
            console.log('Auth guard. Not authenticated, routing to landing');
            this.router.navigate(['/']);
          }
        }
      });
    return this.userData.authenticated$;
  }

}
