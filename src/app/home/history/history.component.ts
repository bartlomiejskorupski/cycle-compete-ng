import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrackRunHistory } from 'src/app/shared/service/track-run/model/track-run-history.model';
import { TrackRunService } from 'src/app/shared/service/track-run/track-run.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy{

  runs: TrackRunHistory[] = [];
  loading = false;

  private sub: Subscription;

  constructor(
    private trackRunService: TrackRunService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.trackRunService.getUserHistory().subscribe({
      next: res => {
        this.loading = false;
        this.runs = res.trackRuns;
        this.runs.forEach(run => run.endDateFormatted = this.numArrayToDate(run.endDate));
      },
      error: _ => this.loading = false
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private numArrayToDate(arr: number[]): Date {
    return new Date(arr[0], arr[1] - 1, arr[2]);
  }

}
