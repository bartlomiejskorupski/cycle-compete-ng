import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MessageService } from 'primeng/api';
import { Observable, Subject, Subscription, auditTime, catchError, debounceTime, mergeMap, of, tap } from 'rxjs';
import { MapService } from 'src/app/home/map/map.service';
import { GetTracksResponse } from 'src/app/shared/service/track/model/get-tracks-response.model';
import { TrackService } from 'src/app/shared/service/track/track.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;
  private map: L.Map;

  private geoLocCircle: L.Circle;
  private geoLocMarker: L.Marker;

  private watchId: number = null;
  private lastLatLon: L.LatLng = null;

  geolocationLoading = false;

  private mapUpdateSubject = new Subject<void>();
  private sub: Subscription;

  private trackMarkers: L.Marker[] = [];

  constructor(
    private mapService: MapService,
    private trackService: TrackService,
    private messages: MessageService
  ) {}

  ngOnInit(): void {
    this.sub = this.mapUpdateSubject
      .pipe(
        debounceTime(1000),
        mergeMap(() => 
          this.trackService.getTracksInsideBounds(this.map.getBounds())
            .pipe(
              catchError(err => {
                this.messages.clear();
                this.messages.add({
                  severity: 'error',
                  detail: err.message,
                  life: 15000
                });
                return of();
              })
            )
        )
      ).subscribe({
        next: this.updateTrackMarkers,
        error: _ => console.log('ERROR: Map update observable ended.')
      });
  }

  ngOnDestroy(): void {
    if(this.watchId) {
      console.log('Geolocation WatchId cleared');
      navigator.geolocation.clearWatch(this.watchId);
    }
    this.sub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.initMap();

    // Update while moving the map
    this.map.on('move', () => this.mapUpdateSubject.next());
    // initial update
    this.mapUpdateSubject.next();
  }

  private initMap(): void {
    console.log('Map init.');
    
    this.map = this.mapService.createMap(this.mapEl.nativeElement);

    this.geoLocCircle = L.circle([0, 0], { radius: 0 }).bindPopup('');
    this.geoLocMarker = L.marker([0, 0]);
  }

  private updateTrackMarkers = (res: GetTracksResponse) => {
    this.trackMarkers.forEach(mark => mark.remove());
    this.trackMarkers = [];

    this.trackMarkers = res.tracks.map(trackRes => {
      const latLng = L.latLng(trackRes.startLatitude, trackRes.startLongitude);
      return this.mapService.createMarker(latLng);
    });

    this.mapService.addLayer(this.map, ...this.trackMarkers);
  }

  geolocationClick(): void {
    if(this.lastLatLon) {
      this.map.setView(this.lastLatLon, 18);
    }
    if(this.watchId) {
      return;
    }
    this.geolocationLoading = true;
    this.watchId = navigator.geolocation.watchPosition(
      this.geolocationSuccess, 
      this.geolocationError,
      { enableHighAccuracy: true, timeout: 3000 }
    );
    console.log('Geolocation WatchId set');
  }

  geolocationSuccess = (pos: GeolocationPosition): void => {
    const { latitude, longitude, accuracy } = pos.coords;
    const latLon = new L.LatLng(latitude, longitude);
    
    console.log(`Geolocation reading, Accuracy: ${accuracy.toFixed(2)}m`);
    if (!this.lastLatLon) {
      this.map.setView(latLon, 18);
    }
    this.lastLatLon = latLon;
    this.geoLocCircle.setLatLng(latLon).setRadius(accuracy).setPopupContent(`Accuracy: ${accuracy.toFixed(2)}m`);
    this.geoLocMarker.setLatLng(latLon);
    this.mapService.addLayer(this.map, this.geoLocCircle, this.geoLocMarker);
    this.geolocationLoading = false;
  }

  geolocationError = (err: GeolocationPositionError): void => {
    // https://stackoverflow.com/questions/61351331/using-geolocation-getcurrentposition-while-testing-on-local-network#answer-61527822
    console.error('Geolocation error: ', err.code, err.message);
    // alert(`Geolocation error: ${err.code} ${err.message}`);
    this.geolocationLoading = false;
  }

}
