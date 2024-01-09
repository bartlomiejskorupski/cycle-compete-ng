import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-track-run',
  templateUrl: './track-run.component.html',
  styleUrls: ['./track-run.component.css'],
  //providers: [MapService]
})
export class TrackRunComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map') mapEl: ElementRef<HTMLDivElement>;

  routeLine: L.Polyline;
  userMarker: L.CircleMarker;

  speed = 8.2;

  constructor(
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.mapService.initializeMap(this.mapEl.nativeElement);
    
    // const userLatLng = this.mapService.createLatLon(54.32579184150523, 18.568514585495);
    // this.userMarker = this.mapService.createCircleMarker(userLatLng, {
    //   radius: 10,
    //   fillOpacity: 0.9,
    //   color: '#00b0e6',
    //   fillColor: '#03c6fc'
    // });

    this.mapService.setView([54.32189592894544, 18.56832967088849], 19);

    this.mapService.updatePolyline([
      [54.32189592894544, 18.56832967088849],
      [54.32206432527174, 18.56870770454407],
      [54.322069156652155, 18.568891988297764],
      [54.32255055532336, 18.568878103724277],
      [54.322883028915015, 18.56883676596226],
      [54.32331660627259, 18.56875046207279],
      [54.32491796949941, 18.56841250377784],
      [54.325090764684276, 18.568394201638515],
      [54.3253272186472, 18.568401932716373],
      [54.32558442196704, 18.56843475023084],
      [54.32571200860365, 18.568468987941745],
      [54.325793329550564, 18.568519003245004],
    ]);
  }

  ngOnDestroy(): void {
    
  }

  

}
