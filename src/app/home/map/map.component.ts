import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit{

  @ViewChild('map') mapEl: ElementRef;
  private map: L.Map;

  private geoLocCircle: L.Circle;
  private geoLocMarker: L.Marker;

  constructor() {}

  ngOnInit(): void {
    
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

    this.geoLocCircle = L.circle([0, 0], 0);
    this.geoLocMarker = L.marker([0, 0]);

  }

  geolocationClick(): void {
    navigator.geolocation.getCurrentPosition(
      this.geolocationSuccess, 
      this.geolocationError,
      { enableHighAccuracy: true }
    );
  }

  geolocationSuccess = (pos: GeolocationPosition): void => {
    console.log('Geolocation success.', pos.coords);
    const latLon = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
    this.map.setView(latLon, 13);
    this.geoLocCircle.removeFrom(this.map).setLatLng(latLon).setRadius(pos.coords.accuracy).addTo(this.map);
    this.geoLocMarker.removeFrom(this.map).setLatLng(latLon).addTo(this.map);
  }

  geolocationError = (err: GeolocationPositionError): void => {
    // https://stackoverflow.com/questions/61351331/using-geolocation-getcurrentposition-while-testing-on-local-network#answer-61527822
    console.error(err);
    alert('Cannot read geolocation data');
    this.geoLocCircle.removeFrom(this.map)
    this.geoLocMarker.removeFrom(this.map)
  }

}
