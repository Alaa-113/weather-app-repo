import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  loading = false;

  constructor(private http: HttpClient, private router: Router) {}

  submit() {
    this.error = '';
    this.success = '';

    if (!this.username || !this.password) {
      this.error = 'Username and password required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.http.post('http://localhost:8000/api/register/', {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.success = 'Registration successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.username || err.error?.error || 'Registration failed';
      }
    });
  }
}