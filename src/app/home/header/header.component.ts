import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SettingsService } from 'src/app/shared/service/settings.service';
import { UserDataService } from 'src/app/shared/service/user-data.service';
import { MapService } from '../../shared/service/map/map.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  sidebarVisible = false;

  navItems: MenuItem[];
  userMenuItems: MenuItem[];

  onlyUserTracks: boolean;

  constructor(
    private userData: UserDataService,
    private settings: SettingsService,
    private map: MapService
  ) {}

  ngOnInit(): void {
    this.navItems = [
      { label: 'Map', icon: 'pi pi-map', routerLink: '/home' },
      { label: 'Tracks', icon: 'pi pi-list', routerLink: '/tracks' },
      { label: 'New Track', icon: 'pi pi-plus', routerLink: '/tracks/new/start' },
      // { label: 'Something', icon: 'pi pi-question-circle', routerLink: '/404' },
    ];
    
    this.onlyUserTracks = this.settings.getShowOnlyMyTracks();
    
    const user = this.userData.user;

    this.userMenuItems = [
      {
        label: `${user.firstname} ${user.lastname}`,
        items: [
          { label: 'History', icon: 'pi pi-history', routerLink: '/history' },
          { label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
          { label: 'Logout', icon: 'pi pi-sign-out', command: this.logout }
        ]
      },
    ];
  }

  logout = () => {
    this.userData.removeUser();
  }

  onChangeOnlyUserTracks() {
    this.settings.setShowOnlyMyTracks(this.onlyUserTracks);
    this.map.showOnlyPrivateTracksChange(this.onlyUserTracks);
  }

}
