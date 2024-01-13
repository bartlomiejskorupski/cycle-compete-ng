import { Injectable } from "@angular/core";
import { BaseHttpService } from "../base-http.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { UserDataService } from "../user-data.service";
import { Observable } from "rxjs";
import { GetTracksResponse } from "./model/get-tracks-response.model";
import { CreateTrackRequest } from "./model/create-track-request.model";
import { TrackPointResponse } from "./model/track-point-response.model";
import { GetClosestTracksResponse } from "./model/get-closest-tracks-response.model";
import { GetTrackResponse } from "./model/get-track-response.model";

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

  getTrack(id: number): Observable<GetTrackResponse>{
    return this.getEnpoint<GetTrackResponse>(`/${id}`);
  }

  getTracksInsideBounds(bounds: L.LatLngBounds): Observable<GetTracksResponse> {
    const params = new HttpParams()
      .append('tlLng', bounds.getNorthWest().lng)
      .append('tlLat', bounds.getNorthWest().lat)
      .append('brLng', bounds.getSouthEast().lng)
      .append('brLat', bounds.getSouthEast().lat);

    return this.getEnpoint<GetTracksResponse>('', params);
  }

  createTrack(name: string, desc: string, startLatLng: L.LatLngTuple, points: L.LatLng[]): Observable<any> {
    const trackPoints: TrackPointResponse[] = [];
    points.forEach((latLng, index) => trackPoints.push({
      longitude: latLng.lng,
      latitude: latLng.lat,
      sequencePosition: index
    }));
    
    console.log(trackPoints);
    
    const requestBody: CreateTrackRequest = {
      name,
      description: desc,
      startLatitude: startLatLng[0],
      startLongitude: startLatLng[1],
      trackPoints
    };
    return this.postEndpoint(requestBody);
  }

  getClosest(n: number, lng: number, lat: number) : Observable<GetClosestTracksResponse> {
    const params = new HttpParams()
      .append('n', n)
      .append('lon', lng)
      .append('lat', lat);
    return this.getEnpoint<GetClosestTracksResponse>('/closest', params);
  }

  deleteTrack(id: number) : Observable<any> {
    return this.deleteEndpoint(`/${id}`);
  }
}