// import { Routes } from '@angular/router';

// export const routes: Routes = [];

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Favorites } from './pages/favorites/favorites';
import { Register } from './pages/register/register';
import { SearchPageComponent } from './pages/search-page/search-page';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'search', component: SearchPageComponent, canActivate: [authGuard] },
  { path: 'favorites', component: Favorites, canActivate: [authGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'register', component: Register },
  { path: 'weather/:city', component: Dashboard, canActivate: [authGuard] },
];