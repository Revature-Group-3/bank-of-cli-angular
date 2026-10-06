import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  RegisterForm = new FormGroup({
    firstName: new FormControl(''),
    LastName: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  })
  // on submit it will print out the data onto the console log
  // Stores data in JSON like structure
  onSubmit() {
    console.log(this.RegisterForm.value);
  }
}
