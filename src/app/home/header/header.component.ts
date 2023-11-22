import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { UserDataService } from 'src/app/shared/service/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  sidebarVisible = false;

  navItems: MenuItem[];
  userMenuItems: MenuItem[];

  constructor(
    private userData: UserDataService
  ) {}

  ngOnInit(): void {
    this.navItems = [
      { label: 'Map', icon: 'pi pi-map', routerLink: '/home' },
      { label: 'Tracks', icon: 'pi pi-list', routerLink: '/tracks' },
      { label: 'New Track', icon: 'pi pi-plus', routerLink: '/404' },
      { label: 'Something', icon: 'pi pi-question-circle', routerLink: '/404' },
    ];

    const user = this.userData.user;

    this.userMenuItems = [
      {
        label: `${user.firstname} ${user.lastname}`,
        items: [
          { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
          { label: 'Logout', icon: 'pi pi-sign-out', command: this.logout }
        ]
      },
    ];
  }

  logout = () => {
    this.userData.removeUser();
  }

}
