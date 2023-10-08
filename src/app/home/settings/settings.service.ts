import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SettingsService {
  
  private animationsEnabled: boolean;

  constructor() {
    const animationsStored = localStorage.getItem('animationsEnabled') ?? 'true';
    this.animationsEnabled = animationsStored === 'true';
    localStorage.setItem('animationsEnabled', this.animationsEnabled+'');
  }

  setAnimationsEnabled(val: boolean): void {
    this.animationsEnabled = val;
    localStorage.setItem('animationsEnabled', val+'');
  }

  getAnimationsEnabled(): boolean {
    return this.animationsEnabled;
  }

}
