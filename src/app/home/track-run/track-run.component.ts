import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../map/map.service';
import { GeolocationService } from 'src/app/shared/service/geolocation.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, exhaustMap, interval, map } from 'rxjs';
import { TrackService } from 'src/app/shared/service/track/track.service';
import { GetTrackResponse } from 'src/app/shared/service/track/model/get-track-response.model';
import { formatTimer } from 'src/app/shared/utils/date-utils';
import { TrackRunService } from 'src/app/shared/service/track-run/track-run.service';
import { MessageService } from 'primeng/api';

type Stage = 'not started' | 'started' | 'finished';

@Component({
  selector: 'app-track-run',
  templateUrl: './track-run.component.html',
  styleUrls: ['./track-run.component.css'],
  //providers: [MapService]
})
export class TrackRunComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;

  stage: Stage = 'not started';

  private timer = {
    start: new Date(),
    now: new Date()
  };

  speed = 0;
  instructions = 'Get to the start';

  private position: L.LatLngTuple;
  private routePoints: L.LatLngTuple[];
  private lastReachedPoint = 0;
  private PROXIMITY_THRESHOLD = 8;

  canStart = false;
  canFinishRun = false;

  private trackId: number;
  trackName: string;

  stopDialogVisible = false;
  finishedDialogVisible = false;

  private subs: Subscription[] = [];

  constructor(
    private map: MapService,
    private geo: GeolocationService,
    private route: ActivatedRoute,
    private trackService: TrackService,
    private trackRunService: TrackRunService,
    private messages: MessageService
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(
      this.geo.position$.subscribe(this.handleGeoSuccess.bind(this)),
      this.geo.error$.subscribe(this.handleGeoError.bind(this)),
      interval(100).subscribe(this.updateTimer.bind(this))
    );
    this.geo.watchPosition();
  }

  ngAfterViewInit(): void {
    this.map.initializeMap(this.mapEl.nativeElement);

    // DEBUG
    this.map.onClick(pos => console.log(pos.latlng.lat, pos.latlng.lng));
    // DEBUG

    this.subs.push(
      this.route.queryParams.pipe(
        map(params => +params['trackId']),
        exhaustMap(trackId => this.trackService.getTrack(trackId))
      ).subscribe(this.handleTrackChange.bind(this))
    );
  }

  private handleTrackChange(res: GetTrackResponse) {
    this.trackId = res.id;
    this.trackName = res.name;
    this.map.setView([res.startLatitude, res.startLongitude], 19);
    this.routePoints = res.trackPoints.map(tp => [tp.latitude, tp.longitude] as L.LatLngTuple);
    this.map.updateRunRoute(this.routePoints, 0);
    this.map.updateStartCircle(this.routePoints[0], this.PROXIMITY_THRESHOLD);
    this.fitUserAndStartOnce();
  }

  private handleGeoSuccess(pos: GeolocationPosition) {
    this.speed = this.metersPerSecondToKmph(pos.coords.speed);
    this.position = [pos.coords.latitude, pos.coords.longitude];
    this.updateRunProgress();
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

  private updateRunProgress() {
    this.map.updateUserMarker(this.position);

    if(!this.routePoints) 
      return;

    this.fitUserAndStartOnce();

    if(this.stage === 'not started') {
      this.map.updateDottedLine(this.position, this.routePoints[0]);
      if(this.map.isCloseToPoint(this.position, this.routePoints[0])) {
        this.canStart = true;
        this.instructions = '';
      }
      else {
        this.canStart = false;
        this.instructions = 'Get to the start';
      }
    }
    else if(this.stage === 'started') {
      this.calculateRouteProgress();

      const onPath = this.map.isOnPath(this.position, this.routePoints, 10);
      if(!onPath) {
        this.instructions = 'Too far away from the path!';
      }
      else {
        this.instructions = '';
      }
    }
    else if (this.stage === 'finished') {

    }

  }

  private calculateRouteProgress() {
    if(this.checkIfFinished()) {
      return;
    }

    let nextPoint = this.routePoints[this.lastReachedPoint + 1];
    
    console.log(nextPoint, this.lastReachedPoint, this.routePoints.length);
    

    let nextPointReached = this.map.isCloseToPoint(this.position, nextPoint, this.PROXIMITY_THRESHOLD);
    let updateRoute = false;

    while(nextPointReached) {
      this.lastReachedPoint++;
      updateRoute = true;
      console.log('Next point reached:', this.lastReachedPoint); 

      if(this.checkIfFinished()) {
        break;
      }

      nextPoint = this.routePoints[this.lastReachedPoint + 1];
      nextPointReached = this.map.isCloseToPoint(this.position, nextPoint, this.PROXIMITY_THRESHOLD);
    }

    if(updateRoute) {
      this.map.updateRunRoute(this.routePoints, this.lastReachedPoint);
    }
  }

  private checkIfFinished(): boolean {
    if(this.lastReachedPoint >= this.routePoints.length - 1) {
      this.stage = 'finished';
      this.timer.now = new Date();
      this.finishedDialogVisible = true;
      this.trackRunService.createTrackRun(this.trackId, this.timer.start, this.timer.now)
        .subscribe({ 
          next: _ => this.canFinishRun = true,
          error: err => {
            this.messages.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message,
              life: 3000
            });
            this.canFinishRun = true;
          }
        });
      return true;
    }
    return false;
  }

  startRun() {
    this.timer.start = new Date();
    this.timer.now = new Date();
    this.stage = 'started';
    this.canStart = false;
    console.log('Run started');

    this.map.removeDottedLine();
    this.map.removeStartCircle();
    this.calculateRouteProgress();
  }

  private fitted = false;
  private fitUserAndStartOnce() {
    if(this.fitted) return;
    if(!this.routePoints || !this.position) return;
    this.fitted = true;
    const latLngs: L.LatLngExpression[] = [];
    latLngs.push(this.routePoints[0]);
    latLngs.push(this.position);
    this.map.fitOnMap(latLngs);
  }

  private updateTimer() {
    if(this.stage === 'finished'){
      return;
    }
    this.timer.now = new Date();
  }

  getTimerText(): string {
    if(this.stage === 'not started') {
      return '00:00:00';
    }
    return formatTimer(this.timer.start, this.timer.now);
  }

  private metersPerSecondToKmph(mps: number): number {
    return mps*3600/1000;
  }

  navigationClick() {
    if(!!this.position)
      this.map.setView(this.position);
  }

  stopClick() {
    this.stopDialogVisible = true;
  }

  stopCancelClick() {
    this.stopDialogVisible = false;
  }

}
