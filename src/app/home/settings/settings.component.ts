import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/auth/model/user.model';
import { UserDataService } from 'src/app/shared/service/user-data.service';
import { UserService } from 'src/app/shared/service/user/user.service';
import { environment } from 'src/environments/environment';
import { SettingsService } from '../../shared/service/settings.service';

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
  
  editDialogVisible = false;
  editDialogLoading = false;

  pwdDialogVisible = false;
  pwdDialogLoading = false;

  deleteDialogVisible = false;
  deleteDialogLoading = false;

  get animationsEnabled(): boolean {
    return this.settings.getAnimationsEnabled();
  }

  set animationsEnabled(val: boolean) {
    this.settings.setAnimationsEnabled(val);
  }

  constructor(
    private userData: UserDataService,
    private userService: UserService,
    private messages: MessageService,
    private settings: SettingsService
  ) {}

  ngOnInit(): void {
    this.appVersion = environment.version;

    this.user = this.userData.user;
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
    this.editDialogLoading = true;
    this.userService.editInfo({ firstname, lastname }).subscribe({
      next: (res) => {
        console.log('User info changed.');

        this.messages.add({
          severity: 'success',
          detail: 'User info changed!',
          life: 5000
        });
        
        this.userData.user = {
          ...this.user,
          firstname: res.firstname,
          lastname: res.lastname
        }
        this.user = this.userData.user;
        this.editDialogVisible = false;
        this.editDialogLoading = false;
      },
      error: (err: Error) => {
        console.log('Error changing user info.');
        
        this.messages.add({
          severity: 'error',
          detail: err.message,
          life: 15000
        });
        
        this.editDialogVisible = false;
        this.editDialogLoading = false;
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

    this.pwdDialogLoading = true;
    this.userService.changePassword({oldPassword, newPassword}).subscribe({
      next: _ => {
        console.log('Password changed.');

        this.messages.add({
          severity: 'success',
          detail: 'Password changed!',
          life: 5000
        });

        this.pwdDialogLoading = false;
        this.pwdDialogVisible = false;
      },
      error: (err: Error) => {
        console.log('Error changing password');

        this.messages.add({
          severity: 'error',
          detail: err.message,
          life: 15000
        });

        this.pwdDialogLoading = false;
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
    this.deleteDialogLoading = true;
    this.userService.deleteAccount().subscribe({
      next: _ => {
        console.log('Account deleted.');

        this.messages.add({
          severity: 'success',
          detail: 'Account deleted!',
          life: 10000
        });

        this.deleteDialogVisible = false;
        this.deleteDialogLoading = false;
        this.userData.removeUser();
      },
      error: (err: Error) => {
        console.log('Error deleting account');

        this.messages.add({
          severity: 'error',
          detail: err.message,
          life: 15000
        });

        this.deleteDialogVisible = false;
        this.deleteDialogLoading = false;
      }
    });
  }

  resetForm(form: NgForm) {
    form.reset();
  }

}
