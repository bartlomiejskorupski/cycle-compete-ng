import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NewTrackService } from '../new-track.service';
import { MapService } from '../../map/map.service';
import { LeafletMouseEvent } from 'leaflet';

@Component({
  selector: 'app-new-track-start',
  templateUrl: './new-track-start.component.html',
  styleUrls: ['./new-track-start.component.css']
})
export class NewTrackStartComponent implements AfterViewInit {

  @ViewChild('map') mapEl: ElementRef<HTMLElement>;
  private map: L.Map;

  private startMarker: L.Marker;

  constructor(
    private service: NewTrackService,
    private mapService: MapService
  ) {}

  ngAfterViewInit(): void {
    this.map = this.mapService.createMap(this.mapEl.nativeElement);
    
    this.startMarker = this.mapService.createMarker();

    if(!!this.service.startLatLng) {
      this.startMarker.setLatLng(this.service.startLatLng);
      this.mapService.addLayer(this.map, this.startMarker);   
      this.map.setView(this.service.startLatLng, 18);
    }
    

    this.map.on("click", this.onMapClick);
  }

  onMapClick = (e: LeafletMouseEvent) => {
    this.startMarker.setLatLng(e.latlng);
    this.mapService.addLayer(this.map, this.startMarker);    
    this.service.startLatLng = e.latlng;
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

}
