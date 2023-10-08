import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  private subs: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log('Configuration:', environment.production ? 'Production' : 'Development');
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  getRouteAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

}
