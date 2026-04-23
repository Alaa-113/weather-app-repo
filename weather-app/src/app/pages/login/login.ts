import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  error = '';
  showRegisterSuggestion = false;
  loading = false;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  submit() {
    if (!this.username || !this.password) {
      this.error = 'Enter username and password';
      this.showRegisterSuggestion = false;
      return;
    }

    this.loading = true;
    this.error = '';
    this.showRegisterSuggestion = false;

    this.auth.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.cdr.detectChanges();
        if (res && res.access) {
          this.router.navigate(['/search']);
        }
      },
      error: (err) => {
        console.log('Login error:', err);
        this.loading = false;
        this.showRegisterSuggestion = true;
        this.error = '';
        this.cdr.detectChanges();
      }
    });
  }
}