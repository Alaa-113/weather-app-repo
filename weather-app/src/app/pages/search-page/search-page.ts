import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.html',
  styleUrls: ['./search-page.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SearchPageComponent {
  
  searchQuery = '';
  recentCities: string[] = [];
  errorMessage = '';
  loading = false;

  constructor(
    private router: Router,
    private weather: WeatherService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadRecentCities();
  }

  loadRecentCities() {
    const saved = localStorage.getItem('recentCities');
    if (saved) {
      this.recentCities = JSON.parse(saved);
    }
  }

  saveRecentCities() {
    localStorage.setItem('recentCities', JSON.stringify(this.recentCities.slice(0, 5)));
  }

  addToRecent(city: string) {
    this.recentCities = [city, ...this.recentCities.filter(c => c !== city)].slice(0, 5);
    this.saveRecentCities();
  }

  removeCity(city: string) {
    this.recentCities = this.recentCities.filter(c => c !== city);
    this.saveRecentCities();
  }

  search() {
    if (!this.searchQuery.trim()) {
      this.errorMessage = 'Please enter a city name';
      this.cdr.detectChanges();
      return;
    }

    this.errorMessage = '';
    this.loading = true;
    const city = this.searchQuery.trim();

    this.weather.getWeather(city).subscribe({
      next: () => {
        this.addToRecent(city);
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/weather', city]);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'City does not exist';
        this.cdr.detectChanges();
      }
    });
  }

  selectCity(city: string) {
    this.searchQuery = city;
    this.search();
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('lastCity');
    this.router.navigate(['/login']);
  }
}