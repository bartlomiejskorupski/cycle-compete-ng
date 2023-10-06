import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/model/user.model';
import { UserService } from 'src/app/shared/service/user/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  appVersion: string;

  user: User;

  @ViewChild('editDialogForm') editDialogForm: NgForm;
  @ViewChild('pwdDialogForm') pwdDialogForm: NgForm;

  deleteDialogVisible = false;
  editDialogVisible = false;
  pwdDialogVisible = false;

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.appVersion = environment.version;

    this.user = this.auth.user;
  }

  editProfileClick() {
    this.editDialogVisible = true;
    this.editDialogForm.setValue({
      firstName: this.user.firstname,
      lastName: this.user.lastname
    });
  }

  editProfileCancelClick() {
    this.editDialogVisible = false;
  }

  editProfileSaveClick() {
    const firstname = this.editDialogForm.value.firstName;
    const lastname = this.editDialogForm.value.lastName;
    console.log('Edit profile:', firstname, lastname);
    // TODO add loading
    this.userService.editInfo({ firstname, lastname }).subscribe({
      next: (res) => {
        // TODO add success message
        console.log('User info changed.');
        this.auth.user = {
          ...this.user,
          firstname: res.firstname,
          lastname: res.lastname
        }
        this.user = this.auth.user;
        this.editDialogVisible = false;
      },
      error: _ => {
        console.log('Error changing user info.');
        
        // TODO add error message
        this.editDialogVisible = false;
      }
    });
  }

  changePasswordClick() {
    this.pwdDialogVisible = true;
    this.pwdDialogForm.reset();
  }

  changePasswordSaveClick() {
    const oldPassword = this.pwdDialogForm.value.currentPassword;
    const newPassword = this.pwdDialogForm.value.passwords.password;

    console.log(oldPassword, newPassword);
    

    this.userService.changePassword({oldPassword, newPassword}).subscribe({
      next: _ => {
        console.log('Password changed.');
        this.pwdDialogVisible = false;
      },
      error: _ => {
        console.log('Error changing password');
        this.pwdDialogVisible = false;
      }
    });
  }

  changePasswordCancelClick() {
    this.pwdDialogVisible = false;
  }

  deleteAccountClick() {
    this.deleteDialogVisible = true;
  }

  deleteAccountDeclineClick() {
    this.deleteDialogVisible = false;
  }

  deleteAccountConfirmClick() {
    this.userService.deleteAccount().subscribe({
      next: _ => {
        console.log('Account deleted.');
        this.deleteDialogVisible = false;
        this.auth.logout();
        this.router.navigate(['']);
      },
      error: _ => {
        console.log('Error deleting account');
        this.deleteDialogVisible = false;
      }
    });
  }

}
