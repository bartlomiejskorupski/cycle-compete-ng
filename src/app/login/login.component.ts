import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loading = false;
  errorMessage = '';

  @ViewChild('loginForm') loginForm: NgForm;

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
    console.log('Submitted form: ', this.loginForm.value);
    const email = this.loginForm.value.email.trim();
    const password = this.loginForm.value.password.trim();

    this.loading = true;
    this.errorMessage = '';
    this.auth.login({email, password}).subscribe({
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
    this.loginForm.controls.password.reset();
  }

  getSumbitIcon(): string {
    return this.loading ? 'pi pi-spinner pi-spin' : '';
  }

}
