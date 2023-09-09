import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  action: 'login' | 'register';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.action = data['action'];
      }
    });
  }

  onSubmit() {
    this.auth.login();
    this.router.navigate(['/']);
  }

}
