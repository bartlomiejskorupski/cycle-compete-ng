import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { slideOver } from './shared/animation/route-animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideOver]
})
export class AppComponent implements OnInit, OnDestroy {

  updatePopupVisible = false;

  subs: Subscription[] = [];

  constructor(
    private updates: SwUpdate
  ) {}

  ngOnInit(): void {
    console.log('Configuration:', environment.production ? 'Production' : 'Development');
    this.checkUpdates();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  checkUpdates() {
    if(!this.updates.isEnabled) {
      console.log('Service worker not enabled.');
      return;
    }
    this.subs.push(this.updates.versionUpdates.subscribe({
      next: (e: VersionEvent) => {
        switch(e.type) {
          case 'VERSION_DETECTED': {
            console.log(`Downloading new app version: ${e.version.hash}`);
            break;
          }
          case 'VERSION_READY': {
            console.log(`Current app version: ${e.currentVersion.hash}`);
            console.log(`New app version ready for use: ${e.latestVersion.hash}`);
            this.updatePopupVisible = true;
            break;
          }
          case 'VERSION_INSTALLATION_FAILED': {
            console.log(`Failed to install app version '${e.version.hash}': ${e.error}`);
            break;
          }
          case 'NO_NEW_VERSION_DETECTED': {
            console.log('No new version detected');
          }
        }
      }
    }));
  }

  updateClick() {
    location.reload();
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

}
