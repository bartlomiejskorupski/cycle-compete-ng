import { Injectable } from "@angular/core";
import * as L from 'leaflet';


@Injectable({ providedIn: 'root' })
export class MapService {

  constructor() {
    
  }

  createMap(element: string | HTMLElement): L.Map {
    const map = L.map(element).setView([54.370978, 18.612741], 13).setZoom(18);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.control.scale().addTo(map);
    L.Icon.Default.imagePath = 'assets/map/';

    return map;
  }

  createMarker() {
    const mark = L.marker([0, 0]);
    return mark;
  }

  addLayer(map: L.Map, layer: L.Layer, ...otherLayers: L.Layer[]) {
    [layer, ...otherLayers].forEach(layer => map.hasLayer(layer) || layer.addTo(map));
  }

}
