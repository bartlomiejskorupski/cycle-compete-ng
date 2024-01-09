import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NewTrackService } from '../new-track.service';
import { MapService } from '../../map/map.service';
import { LeafletMouseEvent } from 'leaflet';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-track-route',
  templateUrl: './new-track-route.component.html',
  styleUrls: ['./new-track-route.component.css'],
  //providers: [MapService]
})
export class NewTrackRouteComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapEl: ElementRef<HTMLElement>;

  routeFound = false;

  private subs: Subscription[] = [];

  constructor(
    private service: NewTrackService,
    private mapService: MapService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(!this.service.startLatLng) {
      this.router.navigate(['tracks', 'new', 'start']);
    }

    this.subs.push(this.mapService.routeFound$.subscribe({
      next: (coords) => {
        this.service.route = coords;
        this.routeFound = true;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    if(!this.service.startLatLng) {
      return;
    }

    this.mapService.initializeMap(this.mapEl.nativeElement);
    this.mapService.addRoutingMachine(this.service.startLatLng);

    // this.mapService.addRouteCreation(
    //   this.service.startLatLng,
    //   this.service.route
    // );

    this.mapService.setView(this.service.startLatLng);

    this.mapService.onClick(this.onMapClick);
  }

  onMapClick = (e: LeafletMouseEvent) => {
    if(!e.latlng) {
      console.log("onMapClick latlng is null");
      return;
    }
    //this.mapService.addRoutePoint(e.latlng);
    this.mapService.setEndRoutePoint(e.latlng);
  }

  // undoClick() {
  //   this.mapService.removeLastRoutePoint();
  //   this.service.route.pop();
  // }

  canClickNext() {
    return this.routeFound;
  }

  backClick() {
    this.router.navigate(['tracks', 'new', 'start']);
  }

  nextClick() {
    
    this.router.navigate(['tracks', 'new', 'info'])
  }
}
