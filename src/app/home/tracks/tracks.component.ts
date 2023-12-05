import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClosestTrackResponse } from 'src/app/shared/service/track/model/closest-track-response.model';
import { GetClosestTracksResponse } from 'src/app/shared/service/track/model/get-closest-tracks-response.model';
import { TrackService } from 'src/app/shared/service/track/track.service';

interface TrackListItem {
  name?: string;
  distance?: number;
}

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css']
})
export class TracksComponent implements OnInit {

  tracks: ClosestTrackResponse[];

  loading: boolean;

  constructor(
    private trackService: TrackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    navigator.geolocation.getCurrentPosition(
      this.geolocationSuccess, this.geolocationError,
      { enableHighAccuracy: true, timeout: 3000 }
    );
  }   

  private geolocationSuccess = (pos: GeolocationPosition): void => {
    const { latitude, longitude, accuracy } = pos.coords;
    
    this.trackService.getClosest(10, longitude, latitude)
      .subscribe({
        next: (res: GetClosestTracksResponse) => {
          this.loading = false;
          this.tracks = res.tracks;
        }
      });
  }
  private geolocationError = (err: GeolocationPositionError): void => {
    console.log(err);
  }

  trackMapClick(id: number) {
    this.router.navigate(['home'], { queryParams: {
      trackId: id
    }});
    
  }

}
