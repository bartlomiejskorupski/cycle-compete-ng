import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NewTrackService } from '../new-track.service';
import { MapService } from '../../map/map.service';
import { LeafletMouseEvent } from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-track-start',
  templateUrl: './new-track-start.component.html',
  styleUrls: ['./new-track-start.component.css'],
  //providers: [MapService]
})
export class NewTrackStartComponent implements AfterViewInit {

  @ViewChild('map') mapEl: ElementRef<HTMLElement>;

  constructor(
    private service: NewTrackService,
    private map: MapService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.map.initializeMap(this.mapEl.nativeElement);

    if(!!this.service.startLatLng) {
      this.map.updateMarker(this.service.startLatLng);
      this.map.setView(this.service.startLatLng, 18);
    }
    
    this.map.onClick(this.onMapClick);
  }

  onMapClick = (e: LeafletMouseEvent) => {
    this.map.updateMarker(e.latlng);
    this.service.startLatLng = [e.latlng.lat, e.latlng.lng];
  }

  onNavigationClick() {
    navigator.geolocation.getCurrentPosition(
      this.navigationSuccess,
      this.navigationError,
      { enableHighAccuracy: true, timeout: 3000 }
    );
  }

  private navigationSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = pos.coords;
    this.map.setView([latitude, longitude], 18);
    
  }

  private navigationError = (err: GeolocationPositionError) => {
    console.log(err);
    // TODO
  }

  canClickNext() {
    return !!this.service.startLatLng;
  }

  backClick() {
    this.router.navigate(['home']);
  }

  nextClick() {
    this.router.navigate(['tracks', 'new', 'route'])
  }

}
