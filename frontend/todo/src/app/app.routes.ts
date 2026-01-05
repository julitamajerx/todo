import { Routes } from '@angular/router';
import { Home } from '../core/home/home';
import { Login } from '../core/login/login';
import { authGuard } from '../guards/auth-guard';
import { Register } from '../core/register/register';

export const routes: Routes = [
  { path: '', component: Home, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' },
];
