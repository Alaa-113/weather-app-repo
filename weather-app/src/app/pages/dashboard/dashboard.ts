import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Dashboard implements OnInit {
  
  city = '';
  weatherData: any = null;
  forecast: any[] = [];
  hourlyForecast: any[] = [];
  favorites: any[] = [];
  isFavorite = false;
  backgroundImage = '';
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weather: WeatherService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.backgroundImage = 'url(https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?w=1920)';
    
    this.route.params.subscribe((params: any) => {
      if (params['city']) {
        this.city = params['city'];
        this.loadWeatherData();
      } else {
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
          this.city = lastCity;
          this.loadWeatherData();
        }
      }
    });
  }





  loadWeatherData() {
    if (!this.city) return;
    
    const encodedCity = encodeURIComponent(this.city);
    
    this.loading = true;
    this.errorMessage = '';
    
    this.weather.getWeather(encodedCity).subscribe({
      next: (data: any) => {
        this.weatherData = data;
        this.updateBackground(data.condition || 'Clear');
        this.checkIfFavorite();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = `City "${this.city}" not found. Try full name like "New York".`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });


    this.weather.getForecast(encodedCity).subscribe({
      next: (data: any) => {
        this.processForecastData(data);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Forecast error:', err);
      }
    });
  }





  processForecastData(data: any) {
    if (!data?.list) return;

    this.hourlyForecast = [];

    this.forecast = data.list.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }),
      temp: Math.round(item.temp),
      condition: item.condition,
    }));
  }




  

  updateBackground(condition: string) {
    const conditionLower = condition.toLowerCase();
    
    let imageUrl = '';
    
    if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
      imageUrl = 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2xlYXIlMjBza3l8ZW58MHx8MHx8fDA%3D';
    } else if (conditionLower.includes('cloud')) {
      imageUrl = 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?w=1920';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      imageUrl = 'https://images.unsplash.com/photo-1507027682794-35e6c12ad5b4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmFpbnxlbnwwfHwwfHx8MA%3D%3D';
    } else if (conditionLower.includes('snow')) {
      imageUrl = 'https://images.unsplash.com/photo-1453306458620-5bbef13a5bca?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHNub3d8ZW58MHx8MHx8fDA%3D';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      imageUrl = 'https://images.unsplash.com/photo-1559087867-ce4c91325525?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGh1bmRlcnxlbnwwfHwwfHx8MA%3D%3D';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
      imageUrl = 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Zm9nfGVufDB8fDB8fHww';
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xvdWRzfGVufDB8fDB8fHww';
    }
    
    this.backgroundImage = `url(${imageUrl})`;
  }

  checkIfFavorite() {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        const favorites = JSON.parse(saved);
        this.isFavorite = favorites.some((fav: any) => 
          fav.name.toLowerCase() === this.city.toLowerCase()
        );
      } catch(e) {
        this.isFavorite = false;
      }
    }
  }

  searchCity() {
    if (this.city) {
      this.router.navigate(['/weather', this.city]);
      this.loadWeatherData();
    }
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }

  goToFavorites() {
    localStorage.setItem('lastCity', this.city);
    this.router.navigate(['/favorites']);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('lastCity');
    this.router.navigate(['/login']);
  }

  addToFavorites() {
    if (this.weatherData) {
      const saved = localStorage.getItem('favorites');
      let favorites: any[] = [];
      
      if (saved) {
        try {
          favorites = JSON.parse(saved);
        } catch(e) {
          favorites = [];
        }
      }
      
      const exists = favorites.some((fav: any) => 
        fav.name.toLowerCase() === this.city.toLowerCase()
      );
      
      if (exists) {
        alert('City already in favorites');
        return;
      }
      
      favorites.push({ name: this.city, note: '' });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      this.isFavorite = true;
      alert('Added to favorites');
    }
  }
}