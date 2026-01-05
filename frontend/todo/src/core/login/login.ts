import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private userService = inject(UserService);

  protected loginFrom = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });

  onSubmit() {
    if (this.loginFrom.valid) {
      this.userService.login(this.loginFrom.getRawValue());
    }
  }
}
