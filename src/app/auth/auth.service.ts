import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, take, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthResponse } from "./model/auth-response.model";
import { AuthRequest } from "./model/auth-request.model";
import { RegisterRequest } from "./model/register-request.model";
import { User } from "./model/user.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly url: string;

  private authenticatedSub: BehaviorSubject<boolean>;
  authenticated$: Observable<boolean>;

  private set user(value: User) {
    localStorage.setItem('user', JSON.stringify(value));
  }

  public get user() {
    return JSON.parse(localStorage.getItem('token'));
  }

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.backendUrl + '/auth';

    const initialState = !!this.user;
    this.authenticatedSub = new BehaviorSubject<boolean>(initialState);
    this.authenticated$ = this.authenticatedSub.asObservable();
  }

  login(loginData: AuthRequest): Observable<User> {
    return this.http.post<AuthResponse>(
      this.url + '/authenticate',
      loginData,
      ).pipe(
        take(1),
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

  private handleError = (error: HttpErrorResponse) => {
    console.log('Handling error:', error.status, error.error);
    this.removeUser();
    this.authenticatedSub.next(false);
    switch(error.status) {
      case 0: {
        return throwError(() => new Error('Something went wrong'));
      }
    }
    return throwError(() => new Error(error.error));
  }

  logout() {
    this.removeUser();
    this.authenticatedSub.next(false);
  }

  register(registerData: RegisterRequest): Observable<User> {
    return this.http.post<AuthResponse>(
      this.url + '/register',
      registerData,
      ).pipe(
        take(1),
        catchError(this.handleError),
        map(res => res as User),
        tap(this.handleSuccess)
      );
  }

  private removeUser() {
    localStorage.removeItem('user');
  }

}