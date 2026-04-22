
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }

  add(city: string, notes?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites/`, { city, notes: notes || '' }, { headers: this.getHeaders() });
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/favorites/`, { headers: this.getHeaders() });
  }

  update(id: number, notes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/favorites/${id}/`, { notes }, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${id}/`, { headers: this.getHeaders() });
  }
}