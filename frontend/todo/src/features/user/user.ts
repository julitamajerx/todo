import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  protected loginService = inject(LoginService);
}
