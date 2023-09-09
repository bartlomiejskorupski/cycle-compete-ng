import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {
  private authenticatedSub = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSub.asObservable();

  login() {
    this.authenticatedSub.next(true);
  }

  logout() {
    this.authenticatedSub.next(false);
  }

}