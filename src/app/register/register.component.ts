import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  loading = false;

  @ViewChild('loginForm') loginForm: NgForm;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    
  }

  onSubmit() {
    //this.auth.login();
    // this.router.navigate(['/']);
  }
  
}
