import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";
import { HttpClient } from "@angular/common/http";
import { EditUserRequest } from "./model/edit-user-request.model";
import { Observable } from "rxjs";
import { EditUserResponse } from "./model/edit-user-response.model";
import { EditUserPasswordRequest } from "./model/edit-user-password-request.model";
import { UserDataService } from "../user-data.service";

@Injectable({ providedIn: 'root' })
export class UserService extends BaseHttpService {
  readonly BASE_ENDPOINT: string;

  constructor(
    http: HttpClient,
    userData: UserDataService
  ) {
    super(http, userData);
    this.BASE_ENDPOINT = '/user';
  }

  editInfo(editRequest: EditUserRequest): Observable<EditUserResponse> {
    return this.putEndpoint(editRequest);
  }

  changePassword(changeRequest: EditUserPasswordRequest): Observable<any> {
    return this.putEndpoint(changeRequest, '/password');
  }

  deleteAccount(): Observable<any> {
    return this.deleteEndpoint();
  }

}
