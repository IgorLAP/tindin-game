import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface AuthSuccessApiResponse {
  token: string;
  user: {
    _id: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseApiURL = environment.baseApiURL

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  get isLogged() {
    const token = this.cookieService.get('auth.token')
    if (!token) {
      return false
    } else {
      return true
    }
  }

  auth({ email, password }: { email: string, password: string }):
    Observable<AuthSuccessApiResponse> {
    return this.http.post<AuthSuccessApiResponse>
      (`${this.baseApiURL}auth`, { email, password })
  }
}
