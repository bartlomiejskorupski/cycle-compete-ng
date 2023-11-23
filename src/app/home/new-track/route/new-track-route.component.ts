import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NewTrackService } from '../new-track.service';
import { MapService } from '../../map/map.service';
import { LeafletMouseEvent } from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-track-route',
  templateUrl: './new-track-route.component.html',
  styleUrls: ['./new-track-route.component.css']
})
export class NewTrackRouteComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapEl: ElementRef<HTMLElement>;
  private map: L.Map;

  startMarker: L.CircleMarker;
  route: { latLng: L.LatLng, marker: L.CircleMarker}[] = [];
  routeLine: L.Polyline;

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
    this.map = this.mapService.createMap(this.mapEl.nativeElement);

    const startLatLng = this.service.startLatLng;

    this.startMarker = this.mapService.createCircleMarker(startLatLng, { radius: 10, color: 'red' });

    this.routeLine = this.mapService.createPolyline([startLatLng]);

    this.service.route.forEach(latLng => this.addRoutePoint(latLng));

    this.mapService.addLayer(this.map, this.startMarker, this.routeLine);
    this.map.setView(startLatLng);

    this.map.on("click", this.onMapClick);
  }

  onMapClick = (e: LeafletMouseEvent) => {
    this.addRoutePoint(e.latlng);
    this.service.route.push(e.latlng);
  }

  private addRoutePoint(latLng: L.LatLng) {
    const marker = this.mapService.createCircleMarker(latLng, { radius: 5 });
    this.mapService.addLayer(this.map, marker);
    this.routeLine.addLatLng(latLng);

    this.route.push({
      latLng: latLng,
      marker: marker
    });
  }

  removeLastPoint() {
    const lastPoint = this.route.pop();
    if(!lastPoint)
      return;

    this.map.removeLayer(lastPoint.marker);
    const routeLineLatLngs = this.routeLine.getLatLngs();
    routeLineLatLngs.pop();
    this.routeLine.setLatLngs(routeLineLatLngs);

    this.service.route.pop();
  }

}
