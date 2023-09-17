import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  sidebarVisible = false;

  navItems: MenuItem[];

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.navItems = [
      { label: 'Map', icon: 'pi pi-map', routerLink: '/home' },
      { label: 'Item2', icon: 'pi pi-question-circle', routerLink: '/404' },
      { label: 'Item3', icon: 'pi pi-question-circle', routerLink: '/404' },
    ];
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['']);
  }

}
