import { inject, Injectable, signal } from '@angular/core';
import { LoginResponse, UserCredentials } from '../shared/interfaces/login-response.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { USER_LOGIN_URL, USER_LOGOUT_URL } from '../shared/constants/urls';
import { User } from '../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private userSignal = signal<User | null>(this.getUserFromStorage());
  public user = this.userSignal.asReadonly();
  public loginError = signal<string | null>(null);

  public login(credentials: UserCredentials) {
    this.loginError.set(null);

    this.http
      .post<LoginResponse>(USER_LOGIN_URL, credentials, { withCredentials: true })
      .subscribe({
        next: (response) => {
          const userData: User = {
            id: response.id,
            email: response.email,
            name: response.name,
          };

          this.userSignal.set(userData);
          localStorage.setItem('User', JSON.stringify(userData));
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          console.error('Login error:', err);
          this.loginError.set(err.error.message || 'Błąd logowania');
        },
      });
  }

  public logout() {
    this.http.post(USER_LOGOUT_URL, {}, { withCredentials: true }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  private clearSession() {
    this.userSignal.set(null);
    localStorage.removeItem('User');
    this.router.navigateByUrl('/login');
  }

  private getUserFromStorage(): User | null {
    const data = localStorage.getItem('User');
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}
