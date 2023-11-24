import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const BASE_URL = environment.backendUrl;
    if(req.url.startsWith(BASE_URL + '/auth')) {
      console.log('Auth request, not adding auth header.');
      return next.handle(req);
    }
    // console.log('Adding auth header.');
    const headerValue = 'Bearer ' + JSON.parse(localStorage.getItem('user')).token;
    const modifiedReq = req.clone({
      headers: req.headers.append('Authorization', headerValue)
    });
    
    return next.handle(modifiedReq);
  }

}