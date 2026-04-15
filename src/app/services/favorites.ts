// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Favorites {}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  add(city: string, notes?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/favorites/`, { city_name: city, notes: notes || '' });
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/favorites/`);
  }

  update(id: number, notes: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/favorites/${id}/`, { notes });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${id}/`);
  }
}