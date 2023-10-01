import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/model/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  appVersion: string;

  user: User;

  constructor(
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.appVersion = environment.version;

    this.user = this.auth.user;
  }

}
