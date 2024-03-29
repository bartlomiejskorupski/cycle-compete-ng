import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewTrackService } from '../new-track.service';
import { TrackService } from 'src/app/shared/service/track/track.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MapService } from '../../../shared/service/map/map.service';

@Component({
  selector: 'app-new-track-confirm',
  templateUrl: './new-track-confirm.component.html',
  styleUrls: ['./new-track-confirm.component.css']
})
export class NewTrackConfirmComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;

  name: string;
  description: string;
  isPrivate: 'Yes' | 'No';
  confirmLoading = false;

  constructor(
    private service: NewTrackService,
    private trackService: TrackService,
    private router: Router,
    private messages: MessageService,
    private map: MapService
  ) {}
  
  ngOnInit(): void {
    this.name = this.service.trackName;
    this.description = this.service.trackDesc;
    this.isPrivate = this.service.privacy === 'private' ? 'Yes' : 'No';
  }
  
  ngAfterViewInit(): void {
    this.map.initializeMap(this.mapEl.nativeElement, { view: this.service.route.at(0) });

    this.map.updateDetailsRoute(
      this.service.route.at(0),
      this.service.route.at(-1),
      this.service.route
    );
  }
  
  onConfirmClick() {
    this.confirmLoading = true;
    this.trackService.createTrack(
      this.service.trackName, 
      this.service.trackDesc,
      this.service.route,
      this.service.privacy
      ).subscribe({
        next: () => {
          this.confirmLoading = false;
          console.log("Successfully created new Track.");
          this.messages.add({
            severity: 'success',
            detail: 'New Track Added!',
            life: 5000
          });
          this.router.navigate(['home']);
        },
        error: err => {
          this.confirmLoading = false;
          console.log(err);
          this.messages.add({
            severity: 'error',
            detail: err.message,
            life: 15000
          });
        }
      });
  }

  backClick() {
    this.router.navigate(['tracks', 'new', 'info']);
  }
}
