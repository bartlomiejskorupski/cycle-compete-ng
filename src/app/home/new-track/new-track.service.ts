
export class NewTrackService {

  startLatLng: L.LatLng;

  route: L.LatLng[] = [];

  constructor() {}


  canClickNext(currentStep: number): boolean {
    switch(currentStep){
      case 0: {
        return !!this.startLatLng;
      }
      case 1: {
        return !!this.route && this.route.length > 0;
      }
      default: return true;
    }
  }


}