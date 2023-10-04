import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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

  @ViewChild('editDialogForm') editDialogForm: NgForm;
  @ViewChild('pwdDialogForm') pwdDialogForm: NgForm;

  deleteDialogVisible = false;
  editDialogVisible = false;
  pwdDialogVisible = false;

  constructor(
    private auth: AuthService
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

    this.editDialogVisible = false;
    // TODO
    //this.service.editProfile({ firstname, lastname }).subscribe({});
  }

  changePasswordClick() {
    this.pwdDialogVisible = true;
    this.pwdDialogForm.reset();
  }

  changePasswordSaveClick() {
    this.pwdDialogVisible = false;
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
    // TODO
    this.deleteDialogVisible = false;
  }

}
