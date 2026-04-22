import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

 login(username: string, password: string) {
  return this.http.post(`${this.apiUrl}/login/`, { username, password }).pipe(
    tap((res: any) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
      }
    })
  );
}

  register(username: string, password: string, email?: string): any {
    return this.http.post(`${this.apiUrl}/register/`, { username, password, email });
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
}