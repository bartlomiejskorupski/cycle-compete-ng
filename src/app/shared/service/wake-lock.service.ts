import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class WakeLockService {

  private wakeLock: WakeLockSentinel;

  constructor() {
    if('wakeLock' in navigator) {
      console.log('Wake Lock API supported.');
    }
    else {
      console.log('Wake Lock API NOT supported.');
    }
  }

  lock(){
    navigator.wakeLock.request('screen')
      .then(s => {
        console.log('Wake lock acquired!');
        this.wakeLock = s;
      })
      .catch(err => {
        console.log('Wake lock request failed.', err);
      })
  }

  release() {
    this.wakeLock?.release().then(() => {
      console.log('Wake lock released.');
      this.wakeLock = null;
    }).catch(err => {
      console.log('Wake lock release failed.', err);
    });
  }

}
