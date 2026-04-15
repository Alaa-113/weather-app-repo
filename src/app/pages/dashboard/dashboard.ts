// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   imports: [],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css',
// })
// export class Dashboard {}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WeatherService } from '../../services/weather';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  searchCity: string = '';
  currentWeather: any = null;
  forecastList: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private weatherService: WeatherService,
    private favoritesService: FavoritesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const cityParam = this.route.snapshot.queryParamMap.get('city');
    this.searchCity = cityParam && cityParam.trim() ? cityParam : 'London';
    this.searchWeather();
  }

  searchWeather() {
    if (!this.searchCity.trim()) {
      this.searchCity = 'London';
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.weatherService.getCurrent(this.searchCity).subscribe({
      next: (data: any) => {
        this.currentWeather = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'City not found';
        this.currentWeather = null;
      }
    });

    this.weatherService.getForecast(this.searchCity).subscribe({
      next: (data: any) => {
        this.forecastList = data.list || [];
      },
      error: (err: any) => {
        console.error('Forecast error:', err);
        this.forecastList = [];
      }
    });
  }

  addToFavorites() {
    if (!this.currentWeather) {
      this.errorMessage = 'No weather data to save';
      return;
    }
    
    this.favoritesService.add(this.currentWeather.city).subscribe({
      next: (response: any) => {
        this.successMessage = `${this.currentWeather.city} added to favorites!`;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.error || 'Failed to add to favorites';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  clearSearch() {
    this.searchCity = '';
    this.currentWeather = null;
    this.forecastList = [];
    this.errorMessage = '';
    this.successMessage = '';
  }
}