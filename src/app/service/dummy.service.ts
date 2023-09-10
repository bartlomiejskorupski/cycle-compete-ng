import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http'

@Injectable({providedIn: 'root'})
export class DummyService {

  constructor(
    private http: HttpClient
  ) {}

  getKnook() {
    this.http.get('http://localhost:8080/knook', { responseType: 'text' })
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        }
      });
  }
}
