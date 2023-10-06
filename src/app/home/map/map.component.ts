import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from 'src/app/home/map/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;
  private map: L.Map;

  private geoLocCircle: L.Circle;
  private geoLocMarker: L.Marker;

  private watchId: number = null;
  private lastLatLon: L.LatLng = null;

  geolocationLoading = false;

  constructor(
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    if(this.watchId) {
      console.log('Geolocation WatchId cleared');
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = this.mapService.createMap(this.mapEl.nativeElement);

    this.geoLocCircle = L.circle([0, 0], 0).bindPopup('').addTo(this.map);
    this.geoLocMarker = L.marker([0, 0]).addTo(this.map);
  }

  geolocationClick(): void {
    if(this.lastLatLon) {
      this.map.setView(this.lastLatLon, 18);
    }
    if(this.watchId) {
      return;
    }
    this.geolocationLoading = true;
    this.watchId = navigator.geolocation.watchPosition(
      this.geolocationSuccess, 
      this.geolocationError,
      { enableHighAccuracy: true, timeout: 3000 }
    );
    console.log('Geolocation WatchId set');
  }

  geolocationSuccess = (pos: GeolocationPosition): void => {
    const { latitude, longitude, accuracy } = pos.coords;
    console.log(`Geolocation reading, Accuracy: ${accuracy.toFixed(2)}m`);
    
    const latLon = new L.LatLng(latitude, longitude);
    if (!this.lastLatLon) {
      this.map.setView(latLon, 18);
    }
    this.lastLatLon = latLon;
    this.geoLocCircle.setLatLng(latLon).setRadius(pos.coords.accuracy).setPopupContent(`Accuracy: ${accuracy.toFixed(2)}m`);
    this.geoLocMarker.setLatLng(latLon);
    this.geolocationLoading = false;
  }

  geolocationError = (err: GeolocationPositionError): void => {
    // https://stackoverflow.com/questions/61351331/using-geolocation-getcurrentposition-while-testing-on-local-network#answer-61527822
    console.error('Geolocation error: ', err.code, err.message);
    // alert('Cannot read geolocation data');
    this.lastLatLon = null;
    this.geoLocCircle.removeFrom(this.map)
    this.geoLocMarker.removeFrom(this.map)
    this.geolocationLoading = false;
  }

}
