import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, Subscription, auditTime, catchError, exhaustMap, fromEvent, mergeMap, of } from 'rxjs';
import { MapService } from 'src/app/shared/service/map.service';
import { GetTrackResponse } from 'src/app/shared/service/track/model/get-track-response.model';
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

  geolocationLoading = false;

  private mapUpdateSubject = new Subject<void>();
  private subs: Subscription[] = [];

  constructor(
    private mapService: MapService,
    private trackService: TrackService,
    private messages: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.mapUpdateSubject.pipe(
        auditTime(1000),
        exhaustMap(() => 
          this.trackService.getTracksInsideBounds(this.mapService.getBounds())
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
        next: (res) => this.mapService.updateTrackMarkers(res.tracks),
        error: _ => console.log('ERROR: Map update observable ended.')
      })
    );
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
          // console.log(track);
          this.mapService.setView([track.startLatitude, track.startLongitude], 18);
          track.trackPoints.sort((a, b) => a.sequencePosition - b.sequencePosition);
          const latLngs = track.trackPoints.map(tp => [tp.latitude, tp.longitude]);
          this.mapService.updatePolyline(latLngs as L.LatLngExpression[]);      
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
