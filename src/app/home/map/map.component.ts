import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, Subscription, auditTime, catchError, exhaustMap, map, mergeMap, of } from 'rxjs';
import { User } from 'src/app/auth/model/user.model';
import { MapService } from 'src/app/shared/service/map/map.service';
import { SettingsService } from 'src/app/shared/service/settings.service';
import { GetTrackResponse } from 'src/app/shared/service/track/model/get-track-response.model';
import { GetTracksResponse } from 'src/app/shared/service/track/model/get-tracks-response.model';
import { TrackService } from 'src/app/shared/service/track/track.service';
import { UserDataService } from 'src/app/shared/service/user-data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;

  geolocationLoading = false;

  private mapUpdateSubject = new Subject<void>();
  private subs: Subscription[] = [];

  private user: User;

  constructor(
    private mapService: MapService,
    private trackService: TrackService,
    private messages: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private userData: UserDataService
  ) {}

  ngOnInit(): void {
    this.user = this.userData.user;

    this.subs.push(
      this.mapUpdateSubject.pipe(
        auditTime(1000),
        exhaustMap(() => {
          const bounds = this.mapService.getBounds();
          return this.trackService.getTracksInsideBounds(bounds)
            .pipe(
              catchError(err => {
                this.messages.clear();
                this.messages.add({
                  severity: 'error',
                  detail: err.message,
                  life: 15000
                });
                return of();
              }),
              map(res => ({ res, bounds }))
            )
        })
      ).subscribe({
        next: this.updateTrackMarkers.bind(this),
        error: _ => console.log('ERROR: Map update observable ended.')
      })
    );
  }

  updateTrackMarkers(val: { res: GetTracksResponse, bounds: L.LatLngBounds }) {
    const onlyUserTracks = this.settings.getShowOnlyMyTracks();
    this.mapService.updateTrackMarkers(val.res.tracks, onlyUserTracks ? this.user.id : null, val.bounds);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.mapService.removeGeolocation();
  }

  ngAfterViewInit(): void {
    this.initMap();
    
    // Focus on track
    this.subs.push(
      this.route.queryParams.pipe(
        mergeMap(params => {
          if(!params['trackId']){
            return of(null);
          }
          return this.trackService.getTrack(params.trackId);
        })
      ).subscribe({
        next: (track: GetTrackResponse) => {
          if(!track)
            return;
          this.router.navigate(['details', track.id]);
          //this.mapService.setView([track.startLatitude, track.startLongitude], 18);
          //track.trackPoints.sort((a, b) => a.sequencePosition - b.sequencePosition);
          //const latLngs = track.trackPoints.map(tp => [tp.latitude, tp.longitude]);
          //this.mapService.updatePolyline(latLngs as L.LatLngExpression[]);      
        }
      })
    );

    // Update while moving the map
    this.mapService.onMove(() => this.mapUpdateSubject.next());

    // initial update
    this.mapUpdateSubject.next();
  }

  private initMap(): void {
    this.mapService.initializeMap(this.mapEl.nativeElement);

    const geolocationLoading$ = this.mapService.addGeolocation();
    this.subs.push(
      geolocationLoading$.subscribe(
        loading => this.geolocationLoading = loading
      )
    );
    
    this.subs.push(
      this.mapService.trackPopupClick$.subscribe({
        next: (id) => this.router.navigate(['details', id])
      })
    );
  }



  geolocationClick(): void {
    this.mapService.geolocationClick();
  }

}
