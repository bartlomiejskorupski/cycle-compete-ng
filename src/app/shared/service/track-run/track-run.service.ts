import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";
import { HttpClient } from "@angular/common/http";
import { UserDataService } from "../user-data.service";
import { Observable } from "rxjs";
import { GetTrackRunsResponse } from "./model/get-track-runs-response.mode";

@Injectable({ providedIn: 'root' })
export class TrackRunService extends BaseHttpService{
  readonly BASE_ENDPOINT: string;

  constructor(
    protected http: HttpClient,
    protected userData: UserDataService
  ) {
    super(http, userData);
    this.BASE_ENDPOINT = '/run';
  }

  getBestTrackRuns(trackId: number): Observable<GetTrackRunsResponse> {
    return this.getEnpoint(`/track/${trackId}`);
  }

  createTrackRun(trackId: number, startDate: Date, endDate: Date): Observable<any> {
    return this.postEndpoint({ trackId, startDate, endDate });
  }

}