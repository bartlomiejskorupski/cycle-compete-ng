import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription, mergeMap, tap } from 'rxjs';
import { TrackRunService } from 'src/app/shared/service/track-run/track-run.service';
import { GetTrackResponse } from 'src/app/shared/service/track/model/get-track-response.model';
import { TrackService } from 'src/app/shared/service/track/track.service';
import { MapService } from '../map/map.service';
import { GetTrackRunResponse } from 'src/app/shared/service/track-run/model/get-track-run-response.model';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.css']
})
export class TrackDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;
  private map: L.Map;

  private routeStartMarker: L.CircleMarker;
  private routeEndMarker: L.CircleMarker;
  private routeLine: L.Polyline;

  track: GetTrackResponse;
  trackRuns: GetTrackRunResponse[];

  private trackChangedSubj = new BehaviorSubject<boolean>(false);

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
    ).subscribe({ next: _ => this.trackChangedSubj.next(true) });
  }
    
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.map = this.mapService.createMap(this.mapEl.nativeElement);

    this.trackChangedSubj.subscribe({
      next: (val) => {
        if(!val) return;
        this.updateMap();
      }
    });
  }

  updateMap() {
    const startLatLon = this.mapService.createLatLon(this.track.startLatitude, this.track.startLongitude);
    const lastPoint = this.track.trackPoints[this.track.trackPoints.length - 1];
    const endLatLon = this.mapService.createLatLon(lastPoint.latitude, lastPoint.longitude);
    this.map.setView(startLatLon);

    this.routeStartMarker = this.mapService.createCircleMarker(startLatLon, { radius: 8, color: 'green' });
    this.routeStartMarker.bindPopup('Start here');
    this.routeEndMarker = this.mapService.createCircleMarker(endLatLon, { radius: 8, color: 'red' });

    this.routeLine = this.mapService.createPolyline([]);
    for (const point of this.track.trackPoints) {
      this.routeLine.addLatLng([point.latitude, point.longitude]);
    }

    this.mapService.addLayer(this.map, this.routeLine, this.routeEndMarker, this.routeStartMarker);
  }

}
