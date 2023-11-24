import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { UserDataService } from "../user-data.service";
import { Observable } from "rxjs";
import { GetTracksResponse } from "./model/get-tracks-response.model";
import { CreateTrackRequest } from "./model/create-track-request.model";
import { TrackPointResponse } from "./model/track-point-response.model";

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

  getTracksInsideBounds(bounds: L.LatLngBounds): Observable<GetTracksResponse> {
    const params = new HttpParams()
      .append('tlLng', bounds.getNorthWest().lng)
      .append('tlLat', bounds.getNorthWest().lat)
      .append('brLng', bounds.getSouthEast().lng)
      .append('brLat', bounds.getSouthEast().lat);

    return this.getEnpoint<GetTracksResponse>('', params);
  }

  createTrack(name: string, desc: string, startLatLng: L.LatLng, points: L.LatLng[]): Observable<any> {
    const trackPoints: TrackPointResponse[] = [];
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

    const requestBody: CreateTrackRequest = {
      name,
      description: desc,
      startLatitude: startLatLng.lat,
      startLongitude: startLatLng.lng,
      trackPoints
    };
    return this.postEndpoint(requestBody);
  }




}