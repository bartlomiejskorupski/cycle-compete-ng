import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "src/app/auth/model/user.model";

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private authenticatedSub: BehaviorSubject<boolean>;
  authenticated$: Observable<boolean>;

  public set user(value: User) {
    localStorage.setItem('user', JSON.stringify(value));
    this.authenticatedSub.next(true);
  }

  public get user() {
    return JSON.parse(localStorage.getItem('user'));
  }

  constructor(
    private router: Router
  ) {
    const initialState = !!this.user;
    this.authenticatedSub = new BehaviorSubject<boolean>(initialState);
    this.authenticated$ = this.authenticatedSub.asObservable();
  }

  public removeUser() {
    localStorage.removeItem('user');
    this.authenticatedSub.next(false);
    this.router.navigate(['']);
  }

  
}
