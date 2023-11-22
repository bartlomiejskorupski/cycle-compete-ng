import { Component, OnInit } from '@angular/core';

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

  tracks: TrackListItem[];

  constructor() {

  }

  ngOnInit(): void {
    this.tracks = [
      { name: 'Track 1', distance: 1.34 },
      { name: 'Track 2', distance: 2.13 },
      { name: 'Track 3', distance: 3.14 },
      { name: 'Track 4', distance: 3.16 },
      { name: 'Track 5', distance: 3.23 },
      { name: 'Track 6', distance: 24.16 },
      { name: 'Track 7', distance: 35.01 },
      { name: 'Track 8', distance: 16.99 },
      { name: 'Track 9', distance: 17.06 },
      { name: 'Track 1', distance: 1.34 },
      { name: 'Track 2', distance: 2.13 },
      { name: 'Track 3', distance: 3.14 },
      { name: 'Track 4', distance: 3.16 },
      { name: 'Track 5', distance: 3.23 },
      { name: 'Track 6', distance: 4.16 },
      { name: 'Track 7', distance: 5.01 },
      { name: 'Track 8', distance: 6.99 },
      { name: 'Track 9', distance: 7.06 },
    ];
  }

}
