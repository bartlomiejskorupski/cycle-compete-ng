import { Component, OnDestroy, OnInit } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-update-popup',
  templateUrl: './update-popup.component.html',
  styleUrls: ['./update-popup.component.css']
})
export class UpdatePopupComponent implements OnInit, OnDestroy {
  updatePopupVisible = false;

  private sub: Subscription;

  constructor(
    private updates: SwUpdate
  ) {}

  ngOnInit(): void {
    if(!this.updates.isEnabled) {
      console.log('Service worker not enabled.');
      return;
    }
    this.sub = this.updates.versionUpdates.subscribe({
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
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  updateClick() {
    location.reload();
  }

}
