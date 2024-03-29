import { Component, OnInit } from '@angular/core';
import { NewTrackService } from '../new-track.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-track-info',
  templateUrl: './new-track-info.component.html',
  styleUrls: ['./new-track-info.component.css']
})
export class NewTrackInfoComponent implements OnInit{

  trackName: string;
  trackDesc: string;
  isPrivate: boolean;

  constructor(
    private service: NewTrackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trackName = this.service.trackName;
    this.trackDesc = this.service.trackDesc;
    this.isPrivate = this.service.privacy === 'private' ? true : false;
  }

  onTrackNameKeyUp() {
    this.service.trackName = this.trackName; 
  }

  onTrackDescKeyUp() {
    this.service.trackDesc = this.trackDesc; 
  }

  onPrivacyChange() {
    this.service.privacy = this.isPrivate ? 'private' : 'public';
  }

  canClickNext() {
    return !!this.service.trackName;
  }

  backClick() {
    this.router.navigate(['tracks', 'new', 'route']);
  }

  nextClick() {
    this.router.navigate(['tracks', 'new', 'confirm'])
  }
}
