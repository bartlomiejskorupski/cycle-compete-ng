import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { slideOver } from './shared/animation/route-animation';
import { SettingsService } from './home/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideOver]
})
export class AppComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

  constructor(
    private settings: SettingsService
  ) {}

  ngOnInit(): void {
    console.log('Configuration:', environment.production ? 'Production' : 'Development');
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    if(!this.settings.getAnimationsEnabled()) {
      return null;
    }
    return outlet?.activatedRouteData?.['animation'];
  }

}
