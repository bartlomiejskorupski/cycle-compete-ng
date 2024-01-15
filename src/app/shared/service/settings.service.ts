import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SettingsService {
  
  private animationsEnabled: boolean;
  private showOnlyMyTracks: boolean;

  constructor() {
    const animationsStored = localStorage.getItem('animationsEnabled') ?? 'true';
    this.animationsEnabled = animationsStored === 'true';
    localStorage.setItem('animationsEnabled', this.animationsEnabled+'');

    const showPrivateTracksStored = localStorage.getItem('showOnlyPrivateTracks') ?? 'false';
    this.showOnlyMyTracks = showPrivateTracksStored === 'true';
    localStorage.setItem('showOnlyPrivateTracks', this.showOnlyMyTracks+'');
  }

  setAnimationsEnabled(val: boolean): void {
    this.animationsEnabled = val;
    localStorage.setItem('animationsEnabled', val+'');
  }

  getAnimationsEnabled(): boolean {
    return this.animationsEnabled;
  }

  setShowOnlyMyTracks(val: boolean): void {
    this.showOnlyMyTracks = val;
    localStorage.setItem('showOnlyPrivateTracks', val+'');
  }

  getShowOnlyMyTracks(): boolean {
    return this.showOnlyMyTracks;
  }

}
