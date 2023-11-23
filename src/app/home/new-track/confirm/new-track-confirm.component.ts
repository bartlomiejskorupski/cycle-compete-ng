import { Component } from '@angular/core';
import { NewTrackService } from '../new-track.service';
import { TrackService } from 'src/app/shared/service/track/track.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-track-confirm',
  templateUrl: './new-track-confirm.component.html',
  styleUrls: ['./new-track-confirm.component.css']
})
export class NewTrackConfirmComponent {

  constructor(
    private service: NewTrackService,
    private trackService: TrackService,
    private router: Router,
    private messages: MessageService,
  ) {}

  onConfirmClick() {
    this.trackService.createTrack(
      this.service.trackName, 
      this.service.trackDesc, 
      this.service.startLatLng, 
      [this.service.startLatLng, ...this.service.route])
      .subscribe({
        next: () => {
          console.log("Successfully created new Track.");
          this.messages.add({
            severity: 'success',
            detail: 'New Track Added!',
            life: 5000
          });
          this.router.navigate(['home']);
        },
        error: err => {
          console.log(err);
        }
      });
  }

}
