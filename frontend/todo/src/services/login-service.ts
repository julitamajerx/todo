import { inject, Injectable, signal } from '@angular/core';
import { LoginResponse, UserCredentials } from '../shared/interfaces/login-response.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { USER_LOGIN_URL, USER_LOGOUT_URL } from '../shared/constants/urls';
import { User } from '../shared/models/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userSignal = signal<User | null>(this.getUserFromStorage());
  public user = this.userSignal.asReadonly();

  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  public login(credentials: UserCredentials) {
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
          this.toastr.success(response.message, 'Login');
        },
        error: (err) => {
          this.toastr.error(err.message, 'Login error');
          console.log(err.message);
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
