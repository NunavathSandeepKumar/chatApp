// Import necessary modules
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf directive

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; 
  signUpForm!: FormGroup; 
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder 
  ) { }

  ngOnInit(): void {
    this.initializeForms(); 
    // if (this.authService.isAuthenticated()) {
    //   this.router.navigate(['/dashboard']);
    // }
  }

  initializeForms() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get loginFormControls() {
    return this.loginForm.controls;
  }

  get signUpFormControls() {
    return this.signUpForm.controls;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return; 
    }

    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        this.authService.storeTokens(res.accessToken, res.refreshToken);
        this.router.navigate(['/dashboard']);
        this.loginForm.reset(); 
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }

  onSignUp() {
    if (this.signUpForm.invalid) {
      return; 
    }
    this.authService.signUp(this.signUpForm.value).subscribe(
      (res) => {
        this.authService.storeTokens(res.accessToken, res.refreshToken);
        this.router.navigate(['/dashboard']);
        this.signUpForm.reset(); 
      },
      (error: any) => {
        this.errorMessage = error;
      }
    );
  }
}
