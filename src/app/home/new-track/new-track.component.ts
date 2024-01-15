import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTrackService } from './new-track.service';

@Component({
  selector: 'app-new-track',
  templateUrl: './new-track.component.html',
  styleUrls: ['./new-track.component.css'],
  providers: [NewTrackService]
})
export class NewTrackComponent implements OnInit {

  stepsItems: MenuItem[];
  stepsActiveIndex: number;

  nextBtnEnabled = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: NewTrackService
  ) {}
  
  ngOnInit(): void {
    this.stepsItems = [
      { label: 'Start', routerLink: 'start'},
      { label: 'Route', routerLink: 'route' },
      { label: 'Info', routerLink: 'info' },
      { label: 'Confirm', routerLink: 'confirm' },
    ];
    
    this.stepsActiveIndex = 0;
    this.router.navigate(['tracks', 'new', 'start'])

  }

  nextClick() {
    this.stepsActiveIndex++;
    const nextPart = this.stepsItems[this.stepsActiveIndex].routerLink;
    this.router.navigate(['tracks', 'new', nextPart])
  }

  backClick() {
    this.stepsActiveIndex--;
    const prevPart = this.stepsItems[this.stepsActiveIndex].routerLink;
    this.router.navigate(['tracks', 'new', prevPart])
  }

}
