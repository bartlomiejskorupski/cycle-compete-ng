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
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  
  loading = false;

  @ViewChild('loginForm') loginForm: NgForm;

  private sub: Subscription

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.sub = this.loginForm.valueChanges.subscribe({
      next: val => {
        //console.log(this.loginForm);
        
        
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSubmit() {
    //this.auth.login();
    // this.router.navigate(['/']);
  }
  
}
