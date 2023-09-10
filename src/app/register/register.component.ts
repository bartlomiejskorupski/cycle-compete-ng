import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    
  }

  onSubmit() {
    this.auth.login();
    this.router.navigate(['/']);
  }
}
