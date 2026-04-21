import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class Favorites implements OnInit {
  favorites: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  editingNote: { [key: number]: string } = {};

  constructor(
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    this.favoritesService.getFavorites().subscribe({
      next: (data: any) => {
        this.favorites = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Failed to load favorites';
      }
    });
  }

  viewWeather(cityName: string) {
    this.router.navigate(['/dashboard'], { queryParams: { city: cityName } });
  }

  deleteFavorite(id: number, cityName: string) {
    if (confirm(`Remove ${cityName} from favorites?`)) {
      this.favoritesService.delete(id).subscribe({
        next: () => {
          this.favorites = this.favorites.filter(fav => fav.id !== id);
        },
        error: (err: any) => {
          this.errorMessage = err.error?.error || 'Failed to remove favorite';
        }
      });
    }
  }

  updateNote(id: number) {
    const notes = this.editingNote[id];
    if (notes) {
      this.favoritesService.update(id, notes).subscribe({
        next: () => {
          const favorite = this.favorites.find(fav => fav.id === id);
          if (favorite) {
            favorite.notes = notes;
          }
          delete this.editingNote[id];
        },
        error: (err: any) => {
          this.errorMessage = err.error?.error || 'Failed to update note';
        }
      });
    }
  }

  startEdit(id: number, currentNotes: string) {
    this.editingNote[id] = currentNotes;
  }

  cancelEdit(id: number) {
    delete this.editingNote[id];
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}