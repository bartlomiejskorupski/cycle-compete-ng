import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from "rxjs";
import { AuthResponse } from "./model/auth-response.model";
import { AuthRequest } from "./model/auth-request.model";
import { RegisterRequest } from "./model/register-request.model";
import { User } from "./model/user.model";
import { BaseHttpService } from "../shared/service/base-http.service";

@Injectable({providedIn: 'root'})
export class AuthService extends BaseHttpService{
  readonly BASE_ENDPOINT: string;

  private authenticatedSub: BehaviorSubject<boolean>;
  authenticated$: Observable<boolean>;

  public set user(value: User) {
    localStorage.setItem('user', JSON.stringify(value));
  }

  public get user() {
    return JSON.parse(localStorage.getItem('user'));
  }

  constructor(
    http: HttpClient
  ) {
    super(http);
    this.BASE_ENDPOINT = '/auth';

    const initialState = !!this.user;
    this.authenticatedSub = new BehaviorSubject<boolean>(initialState);
    this.authenticated$ = this.authenticatedSub.asObservable();
  }

  login(loginData: AuthRequest): Observable<User> {
    return this.postEndpoint<AuthResponse>(loginData, '/authenticate')
      .pipe(
        catchError(this.handleError),
        map(res => res as User),
        tap(this.handleSuccess)
      );
  }

  private handleSuccess = (res: User) => {
    console.log('Auth success.', 'Logged in as: ', res.firstname, res.lastname, res.email);
    this.user = res;
    this.authenticatedSub.next(true);
  }

  private handleError = (error: Error) => {
    console.log('Auth error:', error.message);
    this.removeUser();
    this.authenticatedSub.next(false);
    return throwError(() => new Error(error.message));
  }

  logout() {
    this.removeUser();
    this.authenticatedSub.next(false);
  }

  register(registerData: RegisterRequest): Observable<User> {
    return this.postEndpoint<AuthResponse>(registerData ,'/register')
      .pipe(
        catchError(this.handleError),
        map(res => res as User),
        tap(this.handleSuccess)
      );
  }

  private removeUser() {
    localStorage.removeItem('user');
  }

}