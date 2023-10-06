import { HttpClient, HttpErrorResponse, HttpEvent } from "@angular/common/http";
import { Observable, catchError, take, throwError } from "rxjs";
import { environment } from "src/environments/environment";

export abstract class BaseHttpService {
  protected readonly BASE_URL: string;
  abstract readonly BASE_ENDPOINT: string;

  constructor(
    protected http: HttpClient
  ) {
    this.BASE_URL = environment.backendUrl;
  }

  protected getEnpoint<T>(endpoint = '') {
    // TODO: ADD PARAMS
    const url = this.BASE_URL + this.BASE_ENDPOINT + endpoint;
    return this.http.get<T>(url)
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
    console.log('Base Handling error:', error.status, error.error);
    switch(error.status) {
      case 0: {
        return throwError(() => new Error('Something went wrong'));
      }
    }
    return throwError(() => new Error(error.error));
  }

}
