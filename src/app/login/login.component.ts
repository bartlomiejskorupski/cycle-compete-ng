import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loading = false;

  @ViewChild('loginForm') loginForm: NgForm;

  sub: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.auth.authenticated$.subscribe({next: this.authChange});
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private authChange = (authenticated: boolean) => {
    console.log('Auth change', authenticated);
    
    this.loading = false;
    if(authenticated) {
      this.router.navigate(['/home']);
    }
    else {
      // Error message
      this.loginForm?.reset();
    }
  }

  onSubmit() {
    //console.log(this.loginForm.value);
    const email = this.loginForm.value.email.trim();
    const password = this.loginForm.value.password.trim();

    this.loading = true;
    this.auth.login({email, password});
  }

}
