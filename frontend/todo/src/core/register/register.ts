import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { ReactiveFormsModule } from '@angular/forms';
import { NewUserInput } from '../../shared/interfaces/user-response.interface';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected selectedFileName = '';

  private selectedFile: File | null = null;
  private userService = inject(UserService);

  protected registerFrom = new FormGroup({
    name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(6)],
      nonNullable: true,
    }),
  });

  protected onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.selectedFileName = target.files[0].name;
    }
  }

  protected onSubmit() {
    if (this.registerFrom.valid) {
      const userInput: NewUserInput = this.registerFrom.getRawValue();

      const formData = new FormData();
      formData.append('name', userInput.name);
      formData.append('email', userInput.email);
      formData.append('password', userInput.password);

      if (this.selectedFile) {
        formData.append('avatar', this.selectedFile);
      }

      this.userService.register(formData);
    }
  }
}
