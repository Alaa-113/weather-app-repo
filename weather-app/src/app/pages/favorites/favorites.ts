import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FavoriteCity {
  name: string;
  note: string;
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Favorites implements OnInit {
  
  favorites: FavoriteCity[] = [];
  editingNote: { [key: string]: string } = {};

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.favorites = parsed.map((item: any) => {
          if (typeof item === 'string') {
            return { name: item, note: '' };
          } else if (item && typeof item === 'object' && item.name) {
            return { name: item.name, note: item.note || '' };
          }
          return null;
        }).filter((item: any) => item !== null);
        this.saveFavorites();
      } catch(e) {
        this.favorites = [];
      }
    } else {
      this.favorites = [];
    }
  }

  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  removeFavorite(cityName: string) {
    this.favorites = this.favorites.filter(c => c.name !== cityName);
    this.saveFavorites();
  }

  updateNote(cityName: string) {
    const newNote = this.editingNote[cityName];
    if (newNote !== undefined) {
      const city = this.favorites.find(c => c.name === cityName);
      if (city) {
        city.note = newNote;
        this.saveFavorites();
      }
      delete this.editingNote[cityName];
    }
  }

  startEdit(cityName: string, currentNote: string) {
    this.editingNote[cityName] = currentNote;
  }

  cancelEdit(cityName: string) {
    delete this.editingNote[cityName];
  }

  viewCity(cityName: string) {
    localStorage.setItem('lastCity', cityName);
    this.router.navigate(['/weather', cityName]);
  }

  goToDashboard() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      this.router.navigate(['/weather', lastCity]);
    } else if (this.favorites.length > 0) {
      this.router.navigate(['/weather', this.favorites[0].name]);
    } else {
      this.router.navigate(['/weather', 'London']);
    }
  }

  goToSearch() {
    this.router.navigate(['/search']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}