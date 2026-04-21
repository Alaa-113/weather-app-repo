import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8000/api';
  private accessKey = 'access_token';
  private refreshKey = 'refresh_token';
  private usernameKey = 'username';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post(`${this.api}/login/`, { username, password })
      .pipe(tap((res: any) => this.storeTokens(res)));
  }

  register(username: string, password: string) {
    return this.http.post(`${this.api}/register/`, { username, password })
      .pipe(tap((res: any) => this.storeTokens(res)));
  }

  refresh() {
    const refresh = localStorage.getItem(this.refreshKey);
    return this.http.post(`${this.api}/token/refresh/`, { refresh })
      .pipe(tap((res: any) => {
        if (res?.access) {
          localStorage.setItem(this.accessKey, res.access);
        }
      }));
  }

  private storeTokens(res: any) {
    if (res?.access) {
      localStorage.setItem(this.accessKey, res.access);
    }
    if (res?.refresh) {
      localStorage.setItem(this.refreshKey, res.refresh);
    }
    if (res?.username) {
      localStorage.setItem(this.usernameKey, res.username);
    }
  }

  getToken() {
    return localStorage.getItem(this.accessKey);
  }

  getUsername() {
    return localStorage.getItem(this.usernameKey);
  }

  logout() {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.usernameKey);
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }
}
