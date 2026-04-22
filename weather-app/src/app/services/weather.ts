import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }

  getWeather(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/weather/current/?city=${city}`);
  }

  getForecast(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/weather/forecast/?city=${city}`);
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/favorites/`, { headers: this.getHeaders() });
  }
addFavorite(city: string, notes: string): Observable<any> {
  console.log('Adding favorite:', city);
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  
  return this.http.post(`${this.apiUrl}/favorites/`, { city, notes }, { 
    headers: new HttpHeaders({
      'Authorization': `Token ${token}`
    })
  });
}

  updateFavoriteNote(id: number, notes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/favorites/${id}/`, { notes }, { headers: this.getHeaders() });
  }

  deleteFavorite(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${id}/`, { headers: this.getHeaders() });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, { username, password });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout/`, {}, { headers: this.getHeaders() });
  }
}