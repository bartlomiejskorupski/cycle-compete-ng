import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { UserDataService } from '../shared/service/user-data.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(
    private router: Router,
    private userData: UserDataService
  ) {}

  ngOnInit(): void {
    this.userData.authenticated$.pipe(take(1))
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
