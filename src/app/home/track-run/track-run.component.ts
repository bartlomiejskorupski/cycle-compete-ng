import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../map/map.service';
import { GeolocationService } from 'src/app/shared/service/geolocation.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, exhaustMap, interval, map } from 'rxjs';
import { TrackService } from 'src/app/shared/service/track/track.service';
import { GetTrackResponse } from 'src/app/shared/service/track/model/get-track-response.model';
import { formatTimer } from 'src/app/shared/utils/date-utils';

type Stage = 'not started' | 'started' | 'finished';

@Component({
  selector: 'app-track-run',
  templateUrl: './track-run.component.html',
  styleUrls: ['./track-run.component.css'],
  //providers: [MapService]
})
export class TrackRunComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;

  started = true;
  stage: Stage = 'not started';

  startTime = new Date();
  timeNow = new Date();
  speed = 0;
  instructions: string = 'Get to the start';

  position: L.LatLngTuple;
  routePoints: L.LatLngTuple[];

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
    this.routePoints = res.trackPoints.map(tp => [tp.latitude, tp.longitude] as L.LatLngTuple);
    this.map.updatePolyline(this.routePoints, { color: 'red' });
  }

  private handleGeoSuccess(pos: GeolocationPosition) {
    this.speed = this.metersPerSecondToKmph(pos.coords.speed);
    this.position = [pos.coords.latitude, pos.coords.longitude];

    this.fitEverythingOnce();
    this.map.updateMarker(this.position);

    this.map.removeDottedLine();
    if(this.stage === 'not started') {
      this.map.updateDottedLine(this.position, this.routePoints[0]);
    }
    else if(this.stage === 'started') {

    }
    else if (this.stage === 'finished') {

    }

    console.log('Is on path?: ', this.map.isOnPath(this.position, this.routePoints));
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

  private fitted = false;
  private fitEverythingOnce() {
    if(this.fitted) return;
    this.fitted = true;
    const latLngs: L.LatLngExpression[] = [];
    if(this.routePoints)
      latLngs.push(...this.routePoints);
    if(this.position) 
      latLngs.push(this.position);
    this.map.fitOnMap(latLngs);
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
