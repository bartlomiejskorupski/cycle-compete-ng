import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrackRunHistory } from 'src/app/shared/service/track-run/model/track-run-history.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy{

  runs: TrackRunHistory[] = [];

  constructor() {}

  ngOnInit(): void {
    this.runs = [
      { trackName: 'Spinner tour', endDate: new Date(2023, 11, 8), duration: '7:45'},
      { trackName: 'Spinner tour', endDate: new Date(2023, 11, 8), duration: '7:21'},
      { trackName: 'Spinner tour', endDate: new Date(2023, 11, 8), duration: '7:53'},
      { trackName: 'Example st.', endDate: new Date(2023, 10, 23), duration: '20:23'},
      { trackName: 'Example st.', endDate: new Date(2023, 10, 20), duration: '19:56'},
    ];
  }

  ngOnDestroy(): void {
    
  }

}
