import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../map/map.service';
import { GeolocationService } from 'src/app/shared/service/geolocation.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, exhaustMap, interval, map } from 'rxjs';
import { TrackService } from 'src/app/shared/service/track/track.service';
import { GetTrackResponse } from 'src/app/shared/service/track/model/get-track-response.model';
import { formatTimer } from 'src/app/shared/utils/date-utils';

@Component({
  selector: 'app-track-run',
  templateUrl: './track-run.component.html',
  styleUrls: ['./track-run.component.css'],
  //providers: [MapService]
})
export class TrackRunComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;

  routeLine: L.Polyline;
  userMarker: L.CircleMarker;

  started = true;
  startTime = new Date();
  timeNow = new Date();
  speed = 0;
  position: L.LatLngTuple;

  subs: Subscription[] = [];

  constructor(
    private map: MapService,
    private geo: GeolocationService,
    private route: ActivatedRoute,
    private trackService: TrackService
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(
      this.geo.position$.subscribe(this.handleGeoSuccess.bind(this)),
      this.geo.error$.subscribe(this.handleGeoError.bind(this)),
      interval(100).subscribe(() => this.timeNow = new Date())
    );
    this.geo.watchPosition();
  }

  ngAfterViewInit(): void {
    this.map.initializeMap(this.mapEl.nativeElement);

    this.subs.push(
      this.route.queryParams.pipe(
        map(params => +params['trackId']),
        exhaustMap(trackId => this.trackService.getTrack(trackId))
      ).subscribe(this.handleTrackChange.bind(this))
    );
  }

  private handleTrackChange(res: GetTrackResponse) {
    this.map.setView([res.startLatitude, res.startLongitude], 19);
    const route = res.trackPoints.map(tp => [tp.latitude, tp.longitude] as L.LatLngExpression);
    this.map.updatePolyline(route, { color: 'red' });
  }

  private handleGeoSuccess(pos: GeolocationPosition) {
    this.speed = this.metersPerSecondToKmph(pos.coords.speed);
    this.position = [pos.coords.latitude, pos.coords.longitude];
    this.map.updateMarker(this.position);
  }

  private handleGeoError(err: GeolocationPositionError) {
    if(err.code === err.PERMISSION_DENIED) {
      console.error('Geolocation Error', err.code, 'Permission denied');
      alert('To use navigation, allow access to location.');
    }
    else if(err.code === err.POSITION_UNAVAILABLE) {
      console.error('Geolocation Error', err.code, 'Position Unavailable');
    }
    else if(err.code === err.TIMEOUT) {
      console.error('Geolocation Error', err.code, 'Timeout');
    }
  }

  getTimerText(): string {
    if(!this.started) {
      return '00:00:00';
    }
    return formatTimer(this.startTime, this.timeNow);
  }

  private metersPerSecondToKmph(mps: number): number {
    return mps*3600/1000;
  }

  navigationClick() {
    if(!!this.position)
      this.map.setView(this.position);
  }

}
