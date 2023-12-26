import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewTrackService } from '../new-track.service';
import { MapService } from '../../map/map.service';
import { LeafletMouseEvent } from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-track-route',
  templateUrl: './new-track-route.component.html',
  styleUrls: ['./new-track-route.component.css'],
  providers: [MapService]
})
export class NewTrackRouteComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapEl: ElementRef<HTMLElement>;

  constructor(
    private service: NewTrackService,
    private mapService: MapService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(!this.service.startLatLng) {
      this.router.navigate(['tracks', 'new', 'start']);
    }
  }

  ngAfterViewInit(): void {
    this.mapService.initializeMap(this.mapEl.nativeElement);

    this.mapService.addRouteCreation(
      this.service.startLatLng,
      this.service.route
    );

    this.mapService.setView(this.service.startLatLng);

    this.mapService.onClick(this.onMapClick);
  }

  onMapClick = (e: LeafletMouseEvent) => {
    this.mapService.addRoutePoint(e.latlng);
    this.service.route.push([e.latlng.lat, e.latlng.lng]);
  }

  undoClick() {
    this.mapService.removeLastRoutePoint();
    this.service.route.pop();
  }

  canClickNext() {
    return !!this.service.route && this.service.route.length > 0;;
  }

  backClick() {
    this.router.navigate(['tracks', 'new', 'start']);
  }

  nextClick() {
    this.router.navigate(['tracks', 'new', 'info'])
  }
}
