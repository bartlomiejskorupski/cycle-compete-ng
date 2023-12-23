import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, mergeMap, tap } from 'rxjs';
import { TrackRunService } from 'src/app/shared/service/track-run/track-run.service';
import { GetTrackResponse } from 'src/app/shared/service/track/model/get-track-response.model';
import { TrackService } from 'src/app/shared/service/track/track.service';
import { MapService } from '../map/map.service';
import { GetTrackRunResponse } from 'src/app/shared/service/track-run/model/get-track-run-response.model';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.css'],
  providers: [MapService]
})
export class TrackDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;

  track: GetTrackResponse;
  trackRuns: GetTrackRunResponse[];

  private sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private trackService: TrackService,
    private trackRunService: TrackRunService,
    private mapService: MapService,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      mergeMap(params => this.trackService.getTrack(+params.get('id'))),
      tap(trackRes => this.track = trackRes),
      mergeMap(trackRes => this.trackRunService.getBestTrackRuns(trackRes.id)),
      tap(_ => {
        this.trackRuns = [
          { userFirstName: 'Sebastian', userLastName: 'Potrykus', duration: '8:21' },
          { userFirstName: 'Bartłomiej', userLastName: 'Skorupski', duration: '9:48' },
        ];
      })
    ).subscribe({ next: _ => this.updateMap() });
  }
    
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.mapService.initializeMap(this.mapEl.nativeElement);
  }

  updateMap() {
    this.mapService.setView([this.track.startLatitude, this.track.startLongitude]);

    const lastPoint = this.track.trackPoints[this.track.trackPoints.length - 1];
    const endLatLng: [number, number] = [lastPoint.latitude, lastPoint.longitude];
    const startLatLng: [number, number] = [this.track.startLatitude, this.track.startLongitude];
    const routeLatLngs: [number, number][] = this.track.trackPoints.map(p => [p.latitude, p.longitude]);
    
    this.mapService.updateDetailsRoute(startLatLng, endLatLng, routeLatLngs);
  }

}
