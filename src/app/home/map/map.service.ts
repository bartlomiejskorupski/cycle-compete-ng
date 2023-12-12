import { Injectable } from "@angular/core";
import * as L from 'leaflet';


@Injectable({ providedIn: 'root' })
export class MapService {

  constructor() {
    
  }

  createMap(element: string | HTMLElement): L.Map {
    const map = L.map(element, { zoomSnap: 1.0 }).setView([54.370978, 18.612741], 13).setZoom(18);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.control.scale().addTo(map);
    L.Icon.Default.imagePath = 'assets/map/';

    return map;
  }

  createCircleMarker(latLng?: L.LatLng, options: L.CircleMarkerOptions = {}) {
    return L.circleMarker(latLng ?? [0, 0], options);
  }

  createMarker(latLng?: L.LatLng) {
    return L.marker(latLng ?? [0, 0]);
  }

  
  createPolyline(latLngs: L.LatLng[] = [], options: L.PolylineOptions = {}) {
    return L.polyline(latLngs, options);
  }

  createLatLon(lat: number, lon: number): L.LatLng {
    return L.latLng(lat, lon);
  }

  addLayer(map: L.Map, ...otherLayers: L.Layer[]) {
    [...otherLayers].forEach(layer => map.hasLayer(layer) || layer.addTo(map));
  }
  
  removeLayer(map: L.Map, ...layers: L.Layer[]) {
    [...layers].forEach(layer => map.hasLayer(layer) || layer.removeFrom(map));
  }
}
