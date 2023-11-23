import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";
import { HttpClient } from "@angular/common/http";
import { UserDataService } from "../user-data.service";
import { CreateTrackRequest } from "./model/create-track-request.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TrackService extends BaseHttpService{
  readonly BASE_ENDPOINT: string;

  constructor(
    protected http: HttpClient,
    protected userData: UserDataService
  ) {
    super(http, userData);
    this.BASE_ENDPOINT = '/track';
  }

  createTrack(name: string, desc: string, startLatLng: L.LatLng, points: L.LatLng[]): Observable<any> {
    const trackPoints = [];
    trackPoints.push({ 
      longitude: startLatLng.lng,
      latitude: startLatLng.lat,
      sequencePosition: 0
    });
    points.forEach((latLng, index) => trackPoints.push({
      longitude: latLng.lng,
      latitude: latLng.lat,
      sequencePosition: index + 1
    }));

    const requestBody = {
      name,
      description: desc,
      startLatitude: startLatLng.lat,
      startLongitude: startLatLng.lng,
      trackPoints
    };
    return this.postEndpoint(requestBody);
  }

}