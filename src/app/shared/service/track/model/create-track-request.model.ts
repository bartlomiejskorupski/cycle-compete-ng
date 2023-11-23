
export interface CreateTrackRequest {
  name: string;
  description: string;
  startLongitude: number;
  startLatitude: number;
  trackPoints: {
    longitude: number;
    latitude: number;
    sequencePosition: number;
  }[];
}