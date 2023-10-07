import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, tap, throwError } from "rxjs";
import { AuthResponse } from "./model/auth-response.model";
import { AuthRequest } from "./model/auth-request.model";
import { RegisterRequest } from "./model/register-request.model";
import { User } from "./model/user.model";
import { BaseHttpService } from "../shared/service/base-http.service";
import { UserDataService } from "../shared/service/user-data.service";

@Injectable({providedIn: 'root'})
export class AuthService extends BaseHttpService{
  readonly BASE_ENDPOINT: string;

  constructor(
    http: HttpClient,
    userData: UserDataService
  ) {
    super(http, userData);
    this.BASE_ENDPOINT = '/auth';
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
    this.userData.user = res;
  }

  private handleError = (error: Error) => {
    console.log('Auth error:', error.message);
    return throwError(() => new Error(error.message));
  }

  logout() {
    this.userData.removeUser();
  }

  register(registerData: RegisterRequest): Observable<User> {
    return this.postEndpoint<AuthResponse>(registerData ,'/register')
      .pipe(
        catchError(this.handleError),
        map(res => res as User),
        tap(this.handleSuccess)
      );
  }

}