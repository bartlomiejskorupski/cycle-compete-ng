import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.authenticated$.pipe(take(1))
      .subscribe({
        next: authenticated => {
          if(authenticated) {
            console.log('Landing. Already authenticated, routing to /home');
            this.router.navigate(['/home']);
          }
        }
      });
  }
  
  loginClick() {
    this.router.navigate(['login']);
  }

  registerClick() {
    this.router.navigate(['register']);
  }

}
