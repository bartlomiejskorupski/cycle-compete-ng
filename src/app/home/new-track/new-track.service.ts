
export class NewTrackService {

  startLatLng: L.LatLngTuple;

  route: L.LatLng[] = [];

  trackName: string;
  trackDesc: string = '';
  privacy: 'private' | 'public' = 'public';

  constructor() {}

}