
export class NewTrackService {

  startLatLng: L.LatLngTuple;

  // LatLngs without starting LatLng
  route: L.LatLngTuple[] = [];

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