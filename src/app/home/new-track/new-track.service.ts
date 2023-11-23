
export class NewTrackService {

  startLatLng: L.LatLng;

  route: L.LatLng[] = [];

  trackName: string;

  trackDesc: string = '';

  constructor() {}


  canClickNext(currentStep: number): boolean {
    switch(currentStep){
      case 0: {
        return !!this.startLatLng;
      }
      case 1: {
        return !!this.route && this.route.length > 0;
      }
      case 2: {
        return !!this.trackName;
      }
      default: return true;
    }
  }


}