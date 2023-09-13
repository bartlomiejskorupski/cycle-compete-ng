import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  
  loading = false;
  errorMessage = '';

  @ViewChild('registerForm') registerForm: NgForm;

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onSubmit() {
    console.log('Submitted form: ', this.registerForm.value);
    const email = this.registerForm.value.email.trim();
    const firstname = this.registerForm.value.firstName.trim();
    const lastname = this.registerForm.value.lastName.trim();
    const password = this.registerForm.value.passwords.password.trim();

    this.loading = true;
    this.errorMessage = '';
    this.auth.register({email, firstname, lastname, password}).subscribe({
      next: this.handleSuccess,
      error: this.handleError
    });
  }
  
  private handleSuccess = (token: string) => {
    this.loading = false;
    this.router.navigate(['/home']);
  }

  private handleError = (error: Error): void => {
    this.loading = false;
    this.errorMessage = error.message;
    this.registerForm.controls.passwords.reset();
  }

  getSumbitIcon(): string {
    return this.loading ? 'pi pi-spinner pi-spin' : '';
  }

}
