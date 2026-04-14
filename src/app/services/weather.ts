// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Weather {}




import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCurrent(city: string): Observable<any> {
    const params = new HttpParams().set('city', city);
    return this.http.get(`${this.apiUrl}/weather/current/`, { params });
  }

  getForecast(city: string): Observable<any> {
    const params = new HttpParams().set('city', city);
    return this.http.get(`${this.apiUrl}/weather/forecast/`, { params });
  }
}