import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as L from 'leaflet';
import { MessageService } from 'primeng/api';
import { Subject, Subscription, auditTime, catchError, exhaustMap, fromEvent, mergeMap, of } from 'rxjs';
import { MapService } from 'src/app/home/map/map.service';
import { GetTrackResponse } from 'src/app/shared/service/track/model/get-track-response.model';
import { GetTracksResponseTrack } from 'src/app/shared/service/track/model/get-tracks-response-track.model';
import { GetTracksResponse } from 'src/app/shared/service/track/model/get-tracks-response.model';
import { TrackPointResponse } from 'src/app/shared/service/track/model/track-point-response.model';
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

  private routeLine: L.Polyline;

  private watchId: number = null;
  private lastLatLon: L.LatLng = null;

  geolocationLoading = false;

  private mapUpdateSubject = new Subject<void>();
  private subs: Subscription[] = [];

  private trackMarkers: {
    [id: number]: L.Marker
  } = {};

  constructor(
    private mapService: MapService,
    private trackService: TrackService,
    private messages: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.push(this.mapUpdateSubject
      .pipe(
        auditTime(1000),
        exhaustMap(() => 
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
      }));
  }

  ngOnDestroy(): void {
    if(this.watchId) {
      console.log('Geolocation WatchId cleared');
      navigator.geolocation.clearWatch(this.watchId);
    }
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.initMap();
    
    // Focus on track
    this.subs.push(this.route.queryParams
      .pipe(
        mergeMap(params => {
          if(!params['trackId']){
            return of(null);
          }
          return this.trackService.getTrack(params.trackId);
        })
      )
      .subscribe({
      next: (track: GetTrackResponse) => {
        if(!track)
          return;
        console.log(track);
        this.map.setView([track.startLatitude, track.startLongitude], 18);
        this.updateRouteLine(track.trackPoints);
      }
    }));

    // Update while moving the map
    this.map.on('move', () => this.mapUpdateSubject.next());

    // initial update
    this.mapUpdateSubject.next();
  }

  private initMap(): void {
    // console.log('Map init.');
    
    this.map = this.mapService.createMap(this.mapEl.nativeElement);

    this.geoLocCircle = L.circle([0, 0], { radius: 0 }).bindPopup('');
    this.geoLocMarker = L.marker([0, 0]);

    this.routeLine = this.mapService.createPolyline();
    this.mapService.addLayer(this.map, this.routeLine);
  }

  private updateRouteLine(trackPoints: TrackPointResponse[]) {
    const points = [...trackPoints];
    points.sort((a, b) => a.sequencePosition - b.sequencePosition);
    
    this.routeLine.setLatLngs([]);
    points.forEach(point => {
      this.routeLine.addLatLng([point.latitude, point.longitude]);
    });
  }

  private updateTrackMarkers = (res: GetTracksResponse) => {
    // console.log(res);

    res.tracks.forEach(trackRes => {
      const existing = this.trackMarkers?.[trackRes.id];
      if(!existing){
        this.trackMarkers[trackRes.id] = this.createTrackMarker(trackRes);
        this.mapService.addLayer(this.map, this.trackMarkers[trackRes.id]);
        return;
      }
      this.trackMarkers[trackRes.id].setPopupContent(this.createTrackPopup(trackRes));
    });

  }

  private createTrackMarker(trackRes: GetTracksResponseTrack): L.Marker {
    const latLng = L.latLng(trackRes.startLatitude, trackRes.startLongitude);
    const marker = this.mapService.createMarker(latLng);
    marker.bindPopup(this.createTrackPopup(trackRes));
    return marker;
  }

  private createTrackPopup(trackRes: GetTracksResponseTrack): HTMLDivElement {
    const cont = document.createElement('div');
    const name = document.createElement('div');
    name.classList.add('text-lg', 'font-bold');
    name.innerHTML = trackRes.name;
    const user = document.createElement('div');
    user.classList.add('text-400');
    user.innerHTML = trackRes.userFirstname + ' ' + trackRes.userLastname;
    const flexCont = document.createElement('div');
    flexCont.classList.add('mt-2', 'flex', 'justify-content-between', 'gap-4');
    const avgTimeCont = document.createElement('div');
    avgTimeCont.classList.add('text-sm');
    avgTimeCont.innerHTML = `
      <div class="font-bold">Avg. time</div>
      <div class="">${trackRes.averageTime}</div>
    `;
    const showBtn = document.createElement('button');
    showBtn.classList.add('p-element', 'p-button', 'p-component', 'px-2', 'py-1');
    showBtn.innerHTML = 'Show';
    flexCont.append(avgTimeCont, showBtn);
    cont.append(name, user, flexCont);

    showBtn.addEventListener('click', this.showTrackClick(trackRes.id));

    return cont;
  }

  showTrackClick = (id: number) => () =>{
    this.router.navigate(['details', id]);
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
    console.log('Speed:', pos.coords.speed);
    
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
