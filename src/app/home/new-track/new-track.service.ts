
export class NewTrackService {

  startLatLng: L.LatLng;

  constructor() {}


  canClickNext(currentStep: number): boolean {
    switch(currentStep){
      case 0: {
        return !!this.startLatLng;
      }
      default: return true;
    }
  }


}