import { Injectable, OnDestroy } from "@angular/core";
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Observable, Subject } from "rxjs";
import { GetTracksResponseTrack } from "src/app/shared/service/track/model/get-tracks-response-track.model";
import { environment } from "src/environments/environment";

@Injectable()
export class MapService implements OnDestroy {

  private map: L.Map;

  private polyline: L.Polyline;
  private marker: L.Marker;

  private trackMarkers: {
    [id: number]: L.Marker
  } = {};

  private trackPopupClickSubject = new Subject<number>();
  trackPopupClick$ =this.trackPopupClickSubject.asObservable();

  private geolocation?: { 
    marker: L.Marker, 
    circle: L.Circle, 
    lastLatLng: L.LatLngExpression,
    watchId: number,
    loadingSubject: Subject<boolean>;
  };

  private routeCreation: {
    startMarker: L.CircleMarker;
    route: { latLng: L.LatLngExpression, marker: L.CircleMarker }[];
    routeLine: L.Polyline;
  }

  private detailsRoute: {
    routeStartMarker: L.CircleMarker;
    routeEndMarker: L.CircleMarker;
    routeLine: L.Polyline;
  }

  constructor() {}

  ngOnDestroy(): void {
    if(this.geolocation?.watchId) {
      console.log('Geolocation WatchId cleared');
      navigator.geolocation.clearWatch(this.geolocation.watchId);
    }
  }

  initializeMap(element: HTMLElement, opt?: { view?: L.LatLngExpression, zoom?: number }): void {
    this.map = L.map(element, { zoomSnap: 1.0 })
      .setView(opt?.view ?? [54.370978, 18.612741], opt?.zoom ?? 18);

    this.addTileLayer();

    L.Icon.Default.imagePath = 'assets/map/';
    L.control.scale().addTo(this.map);
  }

  private addTileLayer() {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  addGeolocation(): Observable<boolean> {
    this.geolocation = {
      circle: L.circle([0, 0]),
      marker: L.marker([0, 0]),
      lastLatLng: null,
      watchId: null,
      loadingSubject: new Subject()
    };
    return this.geolocation.loadingSubject.asObservable();
  }

  addRouteCreation(startLatLng: L.LatLngExpression, route: L.LatLngExpression[]) {
    this.routeCreation = {
      startMarker: L.circleMarker(startLatLng, { radius: 10, color: 'red' }),
      routeLine: L.polyline([startLatLng]),
      route: []
    };

    route.forEach(latLng => this.addRoutePoint(latLng));

    this.addLayer(this.routeCreation.startMarker, this.routeCreation.routeLine);
  }

  addRoutePoint(latLng: L.LatLngExpression) {
    const marker = L.circleMarker(latLng, { radius: 5 });
    this.addLayer(marker);
    this.routeCreation.routeLine.addLatLng(latLng);

    this.routeCreation.route.push({
      latLng: latLng,
      marker: marker
    });
  }

  removeLastRoutePoint() {
    const lastPoint = this.routeCreation.route.pop();
    if(!lastPoint)
      return;

    this.removeLayer(lastPoint.marker);
    const routeLineLatLngs = this.routeCreation.routeLine.getLatLngs();
    routeLineLatLngs.pop();
    this.routeCreation.routeLine.setLatLngs(routeLineLatLngs);
  }

  addRoutingMachine(startLatLng: L.LatLngExpression) {
    L.Routing.control({
      routeWhileDragging: false,
      router: L.Routing.mapbox('', {
        serviceUrl: environment.backendUrl+'/directions',
        useHints: false,
        profile: 'mapbox/cycling'
      }),
      waypoints: [ 
        L.latLng(startLatLng),
        L.latLng(startLatLng)
      ],
      show: false
    }).addTo(this.map);
  }

  updateDetailsRoute(startLatLng: L.LatLngExpression, endLatLng: L.LatLngExpression, route: L.LatLngExpression[]) {
    this.removeLayer(this.detailsRoute?.routeStartMarker, this.detailsRoute?.routeLine, this.detailsRoute?.routeEndMarker);
    
    this.detailsRoute = {
      routeStartMarker: L.circleMarker(startLatLng, { radius: 8, color: 'green' }),
      routeEndMarker: L.circleMarker(endLatLng, { radius: 8, color: 'red' }),
      routeLine: L.polyline(route)
    };

    this.detailsRoute.routeStartMarker.bindPopup('Start here');

    this.addLayer(this.detailsRoute?.routeStartMarker, this.detailsRoute?.routeLine, this.detailsRoute?.routeEndMarker);
  }

  updatePolyline(latLngs: L.LatLngExpression[]) {
    this.removeLayer(this.polyline);
    this.polyline = L.polyline(latLngs);
    this.addLayer(this.polyline);
  }

  updateMarker(latLng: L.LatLngExpression, opt?: L.MarkerOptions) {
    this.removeLayer(this.marker);
    this.marker = L.marker(latLng, opt);
    this.addLayer(this.marker);
  }

  geolocationClick() {
    if(this.geolocation.lastLatLng) {
      this.map.setView(this.geolocation.lastLatLng, 18);
    }
    if(this.geolocation.watchId) {
      return;
    }

    this.geolocation.loadingSubject.next(true);
    
    this.geolocation.watchId = navigator.geolocation.watchPosition(
      this.geolocationSuccess, 
      this.geolocationError,
      { enableHighAccuracy: true, timeout: 3000 }
    );
    console.log('Geolocation WatchId set');
  }

  private geolocationSuccess = (pos: GeolocationPosition): void => {
    const { latitude, longitude, accuracy } = pos.coords;
    const latLng: L.LatLngExpression = [latitude, longitude];
    
    console.log(`Geolocation reading, Accuracy: ${accuracy.toFixed(2)}m`);
    if (!this.geolocation.lastLatLng) {
      this.map.setView(latLng, 18);
    }
    this.geolocation.lastLatLng = latLng;
    this.geolocation.circle.setLatLng(latLng).setRadius(accuracy);//.setPopupContent(`Accuracy: ${accuracy.toFixed(2)}m`);
    this.geolocation.marker.setLatLng(latLng);
    this.addLayer(this.geolocation.circle, this.geolocation.marker);

    this.geolocation.loadingSubject.next(false);
  }

  private geolocationError = (err: GeolocationPositionError): void => {
    // https://stackoverflow.com/questions/61351331/using-geolocation-getcurrentposition-while-testing-on-local-network#answer-61527822
    console.error('Geolocation error: ', err.code, err.message);
    // alert(`Geolocation error: ${err.code} ${err.message}`);
    this.geolocation.loadingSubject.next(false);
  }

  updateTrackMarkers(tracks: GetTracksResponseTrack[]) {
    tracks.forEach(trackRes => {
      const existing = this.trackMarkers?.[trackRes.id];
      if(!existing){
        this.trackMarkers[trackRes.id] = this.createTrackMarker(trackRes);
        this.addLayer(this.trackMarkers[trackRes.id]);
        return;
      }
      this.trackMarkers[trackRes.id].setPopupContent(this.createTrackPopup(trackRes));
    });

  }

  private createTrackMarker(trackRes: GetTracksResponseTrack): L.Marker {
    const marker = L.marker([trackRes.startLatitude, trackRes.startLongitude]);
    marker.bindPopup(this.createTrackPopup(trackRes));
    return marker;
  }

  private createTrackPopup(trackRes: GetTracksResponseTrack): HTMLDivElement {
    const cont = document.createElement('div');
    const name = document.createElement('div');
    name.classList.add('text-lg', 'font-bold');
    name.innerHTML = trackRes.name;
    const user = document.createElement('div');
    user.classList.add('text-400');
    user.innerHTML = trackRes.userFirstname + ' ' + trackRes.userLastname;
    const flexCont = document.createElement('div');
    flexCont.classList.add('mt-2', 'flex', 'justify-content-between', 'gap-4');
    const avgTimeCont = document.createElement('div');
    avgTimeCont.classList.add('text-sm');
    avgTimeCont.innerHTML = `
      <div class="font-bold">Avg. time</div>
      <div class="">${trackRes.averageTime}</div>
    `;
    const showBtn = document.createElement('button');
    showBtn.classList.add('p-element', 'p-button', 'p-component', 'px-2', 'py-1');
    showBtn.innerHTML = 'Show';
    flexCont.append(avgTimeCont, showBtn);
    cont.append(name, user, flexCont);

    showBtn.addEventListener('click', 
      () => this.trackPopupClickSubject.next(trackRes.id)
    );

    return cont;
  }

  setView(center: L.LatLngExpression, zoom?: number, options?: L.ZoomPanOptions) {
    this.map.setView(center, zoom, options);
  }

  setZoom(zoom: number, options?: L.ZoomPanOptions) {
    this.map.setZoom(zoom, options);
  }

  getBounds(): L.LatLngBounds {
    return this.map.getBounds();
  }

  onMove(fn: L.LeafletEventHandlerFn) {
    this.map.on('move', fn);
  }

  onClick(fn: L.LeafletMouseEventHandlerFn) {
    this.map.on('click', fn);
  }

  private addLayer(...layers: L.Layer[]) {
    layers.forEach(layer => layer && !this.map.hasLayer(layer) && layer.addTo(this.map));
  }
  
  private removeLayer(...layers: L.Layer[]) {
    layers.forEach(layer => layer && this.map.hasLayer(layer) && layer.removeFrom(this.map));
  }
}
