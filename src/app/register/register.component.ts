import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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

  @ViewChild('registerForm') registerForm: NgForm;

  private sub: Subscription

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
      this.registerForm?.controls.passwords.reset();
    }
  }

  onSubmit() {
    const email = this.registerForm.value.email.trim();
    const firstname = this.registerForm.value.firstName.trim();
    const lastname = this.registerForm.value.lastName.trim();
    const password = this.registerForm.value.passwords.password.trim();

    this.loading = true;
    this.auth.register({email, firstname, lastname, password});
  }
  
  getSumbitIcon(): string {
    return this.loading ? 'pi pi-spinner pi-spin' : '';
  }

}
