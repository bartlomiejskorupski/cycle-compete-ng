import { TrackPointResponse } from "./track-point-response.model";

export interface CreateTrackRequest {
  name: string;
  description: string;
  startLongitude: number;
  startLatitude: number;
  privacy: 'public' | 'private';
  trackPoints: TrackPointResponse[];
}