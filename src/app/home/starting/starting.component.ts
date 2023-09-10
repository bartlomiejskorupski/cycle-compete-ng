import { Component } from '@angular/core';
import { DummyService } from 'src/service/dummy.service';

@Component({
  selector: 'app-starting',
  templateUrl: './starting.component.html',
  styleUrls: ['./starting.component.css']
})
export class StartingComponent {

  constructor(
    private dummy: DummyService
  ) {}

  knook() {
    this.dummy.getKnook();
  }

}
