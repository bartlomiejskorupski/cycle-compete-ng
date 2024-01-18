import { Injectable, OnDestroy } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class GeolocationService implements OnDestroy {

  private watchId: number = null;

  private positionSubject = new ReplaySubject<GeolocationPosition>(1);
  position$ = this.positionSubject.asObservable();

  private errorSubject = new Subject<GeolocationPositionError>();
  error$ = this.errorSubject.asObservable();

  constructor() {
    console.log('Geolocation', 'geolocation' in navigator ? 'is' : 'is not', 'available.');
  }

  ngOnDestroy(): void {
    this.stopWatching();
  }

  watchPosition(timeout?: number) {
    this.stopWatching();

    this.watchId = navigator.geolocation.watchPosition(
      pos => this.positionSubject.next(pos),
      err => this.errorSubject.next(err),
      {
        timeout: timeout ?? 3000,
        enableHighAccuracy: true
      }
    );
    console.log('Watching geolocation.');
  }

  stopWatching() {
    if(this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      console.log('Stopped watching geolocation.');
    }
  }

  isWatching() {
    return !!this.watchId;
  }

  getPosition(timeout?: number) {
    navigator.geolocation.getCurrentPosition(
      pos => this.positionSubject.next(pos),
      err => this.errorSubject.next(err),
      {
        timeout: timeout ?? 3000,
        enableHighAccuracy: true
      }
    );
  }

}
