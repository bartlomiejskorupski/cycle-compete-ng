import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-track-run',
  templateUrl: './track-run.component.html',
  styleUrls: ['./track-run.component.css']
})
export class TrackRunComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;
  private map: L.Map;

  routeLine: L.Polyline;
  userMarker: L.CircleMarker;

  speed = 8.2;

  constructor(
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.map = this.mapService.createMap(this.mapEl.nativeElement);
    
    const userLatLng = this.mapService.createLatLon(54.32579184150523, 18.568514585495);
    this.userMarker = this.mapService.createCircleMarker(userLatLng, {
      radius: 10,
      fillOpacity: 0.9,
      color: '#00b0e6',
      fillColor: '#03c6fc'
    });

    this.map.setView(userLatLng, 19);

    this.routeLine = this.mapService.createPolyline([]);
    this.routeLine.addLatLng({lat: 54.32189592894544, lng: 18.56832967088849});
    this.routeLine.addLatLng({lat: 54.32206432527174, lng: 18.56870770454407});
    this.routeLine.addLatLng({lat: 54.322069156652155, lng: 18.568891988297764});
    this.routeLine.addLatLng({lat: 54.32255055532336, lng: 18.568878103724277});
    this.routeLine.addLatLng({lat: 54.322883028915015, lng: 18.56883676596226});
    this.routeLine.addLatLng({lat: 54.32331660627259, lng: 18.56875046207279});
    this.routeLine.addLatLng({lat: 54.32491796949941, lng: 18.56841250377784});
    this.routeLine.addLatLng({lat: 54.32491796949941, lng: 18.56841250377784});
    this.routeLine.addLatLng({lat: 54.325090764684276, lng: 18.568394201638515});
    this.routeLine.addLatLng({lat: 54.3253272186472, lng: 18.568401932716373});
    this.routeLine.addLatLng({lat: 54.32558442196704, lng: 18.56843475023084});
    this.routeLine.addLatLng({lat: 54.32571200860365, lng: 18.568468987941745});
    this.routeLine.addLatLng({lat: 54.325793329550564, lng: 18.568519003245004});

    this.mapService.addLayer(this.map, this.routeLine, this.userMarker);

    this.map.on('click', (e) => {
      console.log(e.latlng);
      
    });
  }

  ngOnDestroy(): void {
    
  }

  

}
