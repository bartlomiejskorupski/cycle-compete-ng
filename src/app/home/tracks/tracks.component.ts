import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { GeolocationService } from 'src/app/shared/service/geolocation.service';
import { ClosestTrackResponse } from 'src/app/shared/service/track/model/closest-track-response.model';
import { GetClosestTracksResponse } from 'src/app/shared/service/track/model/get-closest-tracks-response.model';
import { TrackService } from 'src/app/shared/service/track/track.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css']
})
export class TracksComponent implements OnInit, OnDestroy {

  tracks: ClosestTrackResponse[];

  loading: boolean;

  private subs: Subscription[] = [];

  constructor(
    private trackService: TrackService,
    private router: Router,
    private messages: MessageService,
    private geo: GeolocationService
  ) {}
  
  ngOnInit(): void {
    this.loading = true;

    this.geo.getPosition();
    
    const sub =this.geo.position$.subscribe({
      next: this.geolocationSuccess,
      error: this.geolocationError
    });
    this.subs.push(sub);
  }   

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
  
  private geolocationSuccess = (pos: GeolocationPosition): void => {
    const { latitude, longitude, accuracy } = pos.coords;
    
    this.trackService.getClosest(10, longitude, latitude)
      .subscribe({
        next: (res: GetClosestTracksResponse) => {
          this.loading = false;
          this.tracks = res.tracks;
        },
        error: err => {
          this.messages.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.message,
            life: 5000
          });
          this.loading = false;
        }
      });
  }
  private geolocationError = (err: GeolocationPositionError): void => {
    console.log(err);
    this.loading = false;
  }

  trackMapClick(id: number) {
    this.router.navigate(['home'], { queryParams: {
      trackId: id
    }});
    
  }

}
