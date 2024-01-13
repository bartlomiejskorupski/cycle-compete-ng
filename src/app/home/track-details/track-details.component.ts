import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, mergeMap, tap } from 'rxjs';
import { TrackRunService } from 'src/app/shared/service/track-run/track-run.service';
import { GetTrackResponse } from 'src/app/shared/service/track/model/get-track-response.model';
import { TrackService } from 'src/app/shared/service/track/track.service';
import { MapService } from '../map/map.service';
import { GetTrackRunResponse } from 'src/app/shared/service/track-run/model/get-track-run-response.model';
import { MessageService } from 'primeng/api';
import { UserDataService } from 'src/app/shared/service/user-data.service';

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.css'],
  providers: [MapService]
})
export class TrackDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;

  deleteTrackAllowed = true;
  deleteDialogVisible = false;
  deleteDialogLoading = false;

  track: GetTrackResponse;
  trackRuns: GetTrackRunResponse[];

  private sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private trackService: TrackService,
    private trackRunService: TrackRunService,
    private mapService: MapService,
    private router: Router,
    private messages: MessageService,
    private userService: UserDataService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.pipe(
      mergeMap(params => this.trackService.getTrack(+params.get('id'))),
      tap(trackRes => {
        this.track = trackRes;
        this.deleteTrackAllowed = this.track.creatorId === this.userService.user.id || this.userService.user.role === 'ADMIN' ? false : true;
      }),
      mergeMap(trackRes => this.trackRunService.getBestTrackRuns(trackRes.id)),
      tap(_ => {
        this.trackRuns = [
          { userFirstName: 'Tester', userLastName: 'Testington', duration: '8:21' },
          { userFirstName: 'Tester', userLastName: 'Testington', duration: '9:48' },
          { userFirstName: 'Tester', userLastName: 'Testington', duration: '10:12' },
          { userFirstName: 'Tester', userLastName: 'Testington', duration: '10:18' },
          { userFirstName: 'Tester', userLastName: 'Testington', duration: '10:22' },
          { userFirstName: 'Tester', userLastName: 'Testington', duration: '10:24' },
          { userFirstName: 'Tester', userLastName: 'Testington', duration: '10:29' },
          { userFirstName: 'Tester', userLastName: 'Testington', duration: '10:42' },
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

  deleteTrackClick() {
    this.deleteDialogVisible = true;
  }

  deleteTrackDeclineClick() {
    this.deleteDialogVisible = false;
  }

  deleteTrackConfirmClick() {
    this.deleteDialogLoading = true;
    this.trackService.deleteTrack(
      Number(this.route.snapshot.paramMap.get('id'))
      ).subscribe({
        next: () => {
          console.log("Successfully deleted track.");
          this.messages.add({
            severity: 'success',
            detail: 'Track deleted!',
            life: 5000
          });

          this.deleteDialogVisible = false;
          this.deleteDialogLoading = false;

          this.router.navigate(['home']);
        },
        error: err => {
          console.log(err);
          this.messages.add({
            severity: 'error',
            detail: err.message,
            life: 15000
          });

          this.deleteDialogVisible = false;
          this.deleteDialogLoading = false;
        }
      });
  }

}
