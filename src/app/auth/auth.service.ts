import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, map, take, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { AuthResponse } from "./model/auth-response.model";
import { AuthRequest } from "./model/auth-request.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly url: string;

  private authenticatedSub = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticatedSub.asObservable();

  private set token(value: string) {
    localStorage.setItem('token', value);
  }

  public get token() {
    return localStorage.getItem('token');
  }

  constructor(
    private http: HttpClient
  ) {
    this.url = environment.backendUrl + '/auth';
  }

  login(email: string, password: string): void {
    const requestBody: AuthRequest = { email, password };
    this.http.post<AuthResponse>(
      this.url + '/authenticate',
      requestBody,
      ).pipe(
        take(1),
        catchError(this.handleError),
        map(res => res.token)
      ).subscribe({
        next: this.handleSuccess,
        error: err => {
          console.error(err);
        }
      });
  }

  logout() {
    this.authenticatedSub.next(false);
    this.removeToken();
  }

  private handleSuccess = (token: string) => {
    console.log('Logged in');
    console.log('Token: ' + token);
    this.token = token;
    this.authenticatedSub.next(true);
  }

  private handleError = (error: HttpErrorResponse) => {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    this.authenticatedSub.next(false);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  private removeToken() {
    localStorage.removeItem('token');
  }

}