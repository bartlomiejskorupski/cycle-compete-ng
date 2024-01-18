import { Injectable, OnDestroy } from "@angular/core";
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Observable, Subject } from "rxjs";
import { GetTracksResponseTrack } from "src/app/shared/service/track/model/get-tracks-response-track.model";
import { distanceToPath } from "src/app/shared/utils/distance-utils";
import { environment } from "src/environments/environment";
import { END_ICON, PRIVATE_ICON, START_ICON, USER_ICON } from "./icons";
import { GetTrackResponse } from "../track/model/get-track-response.model";

@Injectable({ providedIn: 'root' })
export class MapService implements OnDestroy {

  private map: L.Map;

  private polyline: L.Polyline;
  private marker: L.Marker;

  private startIcon = START_ICON;
  private endIcon = END_ICON;
  private userIcon = USER_ICON;
  private privateIcon = PRIVATE_ICON;

  constructor() {}

  ngOnDestroy(): void {
    if(this.geolocation?.watchId) {
      console.log('Geolocation WatchId cleared');
      navigator.geolocation.clearWatch(this.geolocation.watchId);
    }
  }

  initializeMap(element: HTMLElement, opt?: { view?: L.LatLngExpression, zoom?: number }): void {
    this.trackMarkers = {};

    const view = opt?.view ?? this.map?.getCenter() ?? [54.370978, 18.612741];
    const zoom = opt?.zoom ?? this.map?.getZoom() ?? 18;

    this.map = L.map(element, { zoomSnap: 1.0 })
      .setView(view, zoom);

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

  updatePolyline(latLngs: L.LatLngExpression[], opt?: L.PolylineOptions) {
    this.removeLayer(this.polyline);
    this.polyline = L.polyline(latLngs, opt);
    this.addLayer(this.polyline);
  }

  updateMarker(latLng: L.LatLngExpression, opt?: L.MarkerOptions) {
    this.removeLayer(this.marker);
    this.marker = L.marker(latLng, opt);
    this.addLayer(this.marker);
  }

  //-----------------------------------------------------------------
  //                        Routing machine

  private routingControl: L.Routing.Control;

  private routeFoundSubject = new Subject<L.LatLng[]>();
  routeFound$ = this.routeFoundSubject.asObservable();

  addRoutingMachine(startLatLng: L.LatLngExpression) {
    this.routingControl = L.Routing.control({
      routeWhileDragging: false,
      router: L.Routing.mapbox('', {
        serviceUrl: environment.backendUrl+'/routing',
        useHints: false,
        profile: 'mapbox/cycling'
      }),
      waypoints: [ 
        L.latLng(startLatLng)
      ],
      show: false,
      plan: L.Routing.plan([L.latLng(startLatLng)], {
        createMarker: (i, w, num) =>  {
          if(i === 0) {
            return L.marker(w.latLng, { icon: this.startIcon, draggable: true });
          }
          if(i === num - 1) {
            return L.marker(w.latLng, { icon: this.endIcon, draggable: true });
          }
          else {
            return L.marker(w.latLng, { draggable: true });
          }
        }
      })
    }).on('routesfound', (e: L.Routing.RoutingResultEvent) => {    
      const firstRoute = e.routes?.at(0);
      this.routeFoundSubject.next(firstRoute?.coordinates);
    }).addTo(this.map);
  }

  setEndRoutePoint(latLng: L.LatLngExpression) {
    const pointsLen = this.routingControl.getWaypoints().length;
    const deleteNum = pointsLen <= 1 ? 0 : 1;
    this.routingControl.spliceWaypoints(pointsLen - 1, deleteNum, L.Routing.waypoint(L.latLng(latLng)));
  }

  //-----------------------------------------------------------------
  //                             Details

  private detailsRoute: {
    routeStartMarker: L.CircleMarker;
    routeEndMarker: L.CircleMarker;
    routeLine: L.Polyline;
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

  //-----------------------------------------------------------------
  //                         Geolocation

  private geolocation?: { 
    marker: L.Marker, 
    circle: L.Circle, 
    lastLatLng: L.LatLngExpression,
    watchId: number,
    loadingSubject: Subject<boolean>;
  };

  addGeolocation(): Observable<boolean> {
    this.geolocation = {
      circle: L.circle([0, 0]),
      marker: L.marker([0, 0], { icon: this.userIcon }),
      lastLatLng: null,
      watchId: null,
      loadingSubject: new Subject()
    };
    return this.geolocation.loadingSubject.asObservable();
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

  removeGeolocation() {
    navigator.geolocation.clearWatch(this.geolocation.watchId);
  }

  private geolocationSuccess = (pos: GeolocationPosition): void => {
    const { latitude, longitude, accuracy } = pos.coords;
    const latLng: L.LatLngExpression = [latitude, longitude];
    
    //console.log(`Geolocation reading, Accuracy: ${accuracy.toFixed(2)}m`);
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
    if(err.code === err.PERMISSION_DENIED) {
      alert('To use navigation, allow access to location.');
      navigator.geolocation.clearWatch(this.geolocation.watchId);
      this.geolocation.watchId = null;
    }
  }

  //-----------------------------------------------------------------
  //                         Track markers

  private trackMarkers: {
    [id: string]: { 
      marker: L.Marker,
      creatorId: number
    }
  } = {};

  private trackPopupClickSubject = new Subject<number>();
  trackPopupClick$ = this.trackPopupClickSubject.asObservable();

  updateTrackMarkers(tracks: GetTracksResponseTrack[], onlyShowOfUserId: number, bounds: L.LatLngBounds) {
    // Remove all markers that are in bounds of the map, but are not in the response
    for(const id in this.trackMarkers) {
      const inBounds = bounds.contains(this.trackMarkers[id].marker.getLatLng());
      if(inBounds && !tracks.map(t => t.id+'').includes(id)) {
        this.removeLayer(this.trackMarkers[id].marker);
        delete this.trackMarkers[id];
      }
    }
    
    // Add every track from response that isn't already in markers
    for(const track of tracks) {
      if(!(track.id in this.trackMarkers)) {
        const newMarker = this.createTrackMarker(track);
        newMarker.setPopupContent(this.createTrackPopup(track));
        this.trackMarkers[track.id] = { marker: newMarker, creatorId: track.creatorId };
      }
    }

    // Filter for all or only private markers
    const filteredMarkers = this.filterTrackMarkers(onlyShowOfUserId);

    // Add markers after filtering to map (will only add if they aren't already on the map)
    this.addLayer(...filteredMarkers);
  }

  showOnlyPrivateTracksChange(onlyPrivate: boolean, userId: number) {
    // Remove all markers from map
    this.removeLayer(...Object.values(this.trackMarkers).map(v => v.marker));
    // Filter for all or only private markers
    const filteredMarkers = this.filterTrackMarkers(onlyPrivate ? userId : null);
    // Add all after filter
    this.addLayer(...filteredMarkers);
  }

  private filterTrackMarkers(onlyPrivateUserId: number): L.Marker[] {
    const onlyPrivate = !!onlyPrivateUserId;

    const filteredMarkers: L.Marker[] = [];
    for (const id in this.trackMarkers) {
      if(!onlyPrivate || this.trackMarkers[id].creatorId === onlyPrivateUserId) {
        filteredMarkers.push(this.trackMarkers[id].marker);
      }
    }
    return filteredMarkers;
  }
  
  private createTrackMarker(trackRes: GetTracksResponseTrack): L.Marker {
    const marker = L.marker([trackRes.startLatitude, trackRes.startLongitude], {
      icon: trackRes.privacy === 'private' ? this.privateIcon : new L.Icon.Default()
    });
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

  // -----------------------------------------------------------------
  //                            Track run

  private dottedLine: L.Polyline;
  private completedRoute: L.Polyline;
  private aheadRoute: L.Polyline;
  private startCircle: L.Circle;

  updateRunRoute(latLngs: L.LatLngExpression[], atIndex: number) {
    this.removeLayer(this.aheadRoute, this.completedRoute);
    const aheadLatLngs = latLngs.slice(atIndex);
    const completedLatLngs = latLngs.slice(0, atIndex + 1);
    this.aheadRoute = L.polyline(aheadLatLngs, { color: '#ff0000', weight: 4 });
    this.completedRoute = L.polyline(completedLatLngs, { color: '#00ef00', weight: 4 });
    this.addLayer(this.aheadRoute, this.completedRoute);
  }

  updateStartCircle(latLng: L.LatLngExpression, radius = 10) {
    this.removeLayer(this.startCircle);
    this.startCircle = L.circle(latLng, { 
      opacity: 0, radius: radius, fillColor: '#00ef00', fillOpacity: 0.5
    });
    this.addLayer(this.startCircle);
  }

  removeStartCircle() {
    this.removeLayer(this.startCircle);
  }

  updateDottedLine(from: L.LatLngExpression, to: L.LatLngExpression) {
    this.removeLayer(this.dottedLine);
    this.dottedLine = L.polyline([from, to], {
      dashArray: '10',
      color: 'gray',
      opacity: 0.8
    });
    this.addLayer(this.dottedLine);
  }

  removeDottedLine() {
    this.removeLayer(this.dottedLine);
  }

  updateUserMarker(latLng: L.LatLngExpression) {
    this.removeLayer(this.marker);
    this.marker = L.marker(latLng, {
      icon: this.userIcon
    });
    this.addLayer(this.marker);
  }

  isOnPath(position: L.LatLngTuple, polylinePoints: L.LatLngTuple[], threshold = 10) {
    const dist = distanceToPath(position, polylinePoints);
    console.log('Distance from path:', dist, 'm');
    return dist <= threshold;
  }

  isCloseToPoint(position: L.LatLngTuple, point: L.LatLngTuple, threshold = 10): boolean {
    const distance = L.latLng(position).distanceTo(point);
    return distance <= threshold;
  }

  // ----------------------------------------------------------------
  //                             Other

  setView(center: L.LatLngExpression, zoom?: number, options?: L.ZoomPanOptions) {
    this.map.setView(center, zoom, options);
  }
  
  setZoom(zoom: number, options?: L.ZoomPanOptions) {
    this.map.setZoom(zoom, options);
  }
  
  getBounds(): L.LatLngBounds {
    return this.map.getBounds();
  }

  fitOnMap(latLngs: L.LatLngExpression[], opts?: L.FitBoundsOptions) {
    const bounds = L.latLngBounds(latLngs);
    this.map.fitBounds(bounds, opts);
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
