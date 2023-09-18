import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy{

  @ViewChild('map') mapEl: ElementRef;
  private map: L.Map;

  private geoLocCircle: L.Circle;
  private geoLocMarker: L.Marker;

  private watchId: number = null;
  private lastLatLon: L.LatLng = null;

  constructor() {}

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
    this.map = L.map(this.mapEl.nativeElement).setView([54.370978, 18.612741], 13).setZoom(18);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    L.control.scale().addTo(this.map);

    L.Icon.Default.imagePath = 'assets/map/';

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
    console.log('Geolocation WatchId set');
    this.watchId = navigator.geolocation.watchPosition(
      this.geolocationSuccess, 
      this.geolocationError,
      { enableHighAccuracy: true, timeout: 3000 }
    );
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
  }

  geolocationError = (err: GeolocationPositionError): void => {
    // https://stackoverflow.com/questions/61351331/using-geolocation-getcurrentposition-while-testing-on-local-network#answer-61527822
    console.error('Geolocation error: ', err.code, err.message);
    // alert('Cannot read geolocation data');
    this.lastLatLon = null;
    this.geoLocCircle.removeFrom(this.map)
    this.geoLocMarker.removeFrom(this.map)
  }

}
