import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, catchError, take, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { UserDataService } from "./user-data.service";

export abstract class BaseHttpService {
  protected readonly BASE_URL: string;
  abstract readonly BASE_ENDPOINT: string;

  constructor(
    protected http: HttpClient,
    protected userData: UserDataService
  ) {
    this.BASE_URL = environment.backendUrl;
  }

  protected getEnpoint<T>(endpoint = '', params: HttpParams = undefined) {
    const url = this.BASE_URL + this.BASE_ENDPOINT + endpoint;
    return this.http.get<T>(url, { params })
      .pipe(
        take(1),
        catchError(this.baseHandleError)
      );
  }

  protected postEndpoint<T>(body: any, endpoint = ''): Observable<T> {
    const url = this.BASE_URL + this.BASE_ENDPOINT + endpoint;
    return this.http.post<T>(url, body)
      .pipe(
        take(1),
        catchError(this.baseHandleError)
      );
  }

  protected putEndpoint<T>(body: any, endpoint = ''): Observable<T> {
    const url = this.BASE_URL + this.BASE_ENDPOINT + endpoint;
    return this.http.put<T>(url, body)
      .pipe(
        take(1),
        catchError(this.baseHandleError)
      );
  }

  protected deleteEndpoint<T>(endpoint = ''): Observable<T> {
    const url = this.BASE_URL + this.BASE_ENDPOINT + endpoint;
    return this.http.delete<T>(url)
      .pipe(
        take(1),
        catchError(this.baseHandleError)
      );
  }

  protected baseHandleError = (error: HttpErrorResponse) => {
    console.log(error);
    
    console.log('Base Handling error:', error.status, error.error);
    switch(error.status) {
      case 0: {
        return throwError(() => new Error('Something went wrong. Check your internet connection and try again.'));
      }
      case 403: {
        this.userData.removeUser();
        return throwError(() => new Error('Session expired. Please login again.'));
      }
      case 504: {
        return throwError(() => new Error('We are experiencing technical difficulties, try again later.'));
      }
    }
    return throwError(() => new Error(error.error));
  }

}
