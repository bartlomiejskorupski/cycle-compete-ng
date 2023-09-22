import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, take, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { AuthResponse } from "./model/auth-response.model";
import { AuthRequest } from "./model/auth-request.model";
import { RegisterRequest } from "./model/register-request.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly url: string;

  private authenticatedSub: BehaviorSubject<boolean>;
  authenticated$: Observable<boolean>;

  private set user(value: AuthResponse) {
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

  login(loginData: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.url + '/authenticate',
      loginData,
      ).pipe(
        take(1),
        catchError(this.handleError),
        tap(this.handleSuccess)
      );
  }

  private handleSuccess = (res: AuthResponse) => {
    console.log('Auth success.', 'Logged in as: ', res.firstname, res.lastname, res.email);
    this.user = res;
    this.authenticatedSub.next(true);
  }

  private handleError = (error: HttpErrorResponse) => {
    console.log('Handling error:', error.status, error.error);
    this.removeToken();
    this.authenticatedSub.next(false);
    switch(error.status) {
      case 0: {
        return throwError(() => new Error('Something went wrong'));
      }
    }
    return throwError(() => new Error(error.error));
  }

  logout() {
    this.removeToken();
    this.authenticatedSub.next(false);
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.url + '/register',
      registerData,
      ).pipe(
        take(1),
        catchError(this.handleError),
        tap(this.handleSuccess)
      );
  }

  private removeToken() {
    localStorage.removeItem('user');
  }

}