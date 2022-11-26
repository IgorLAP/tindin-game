import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.prod';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookie: CookieService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const gamesEndPoint = `${environment.baseApiURL}/games`
    const methodsWithToken = ['DELETE', 'POST', 'PUT']
    for (let i in methodsWithToken) {
      if (req.url.includes(gamesEndPoint) && req.method === methodsWithToken[i]) {
        let token = this.cookie.get('auth.token')
        const request = req.clone({ setHeaders: { 'x-api-key': token } })
        return next.handle(request)
      }
    }

    return next.handle(req)
  }
}
