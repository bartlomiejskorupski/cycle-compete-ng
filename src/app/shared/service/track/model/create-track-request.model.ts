import { TrackPointResponse } from "./track-point-response.model";

export interface CreateTrackRequest {
  name: string;
  description: string;
  startLongitude: number;
  startLatitude: number;
  trackPoints: TrackPointResponse[];
}