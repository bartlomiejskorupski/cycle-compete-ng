import { TrackPointResponse } from "./track-point-response.model";

export interface GetTracksResponse {
  id: number;
  userFirstname: string;
  userLastname: string;
  name: string;
  description: string;
  startLongitude: number;
  startLatitude: number;
  averageTime: Date;
  trackPoints: TrackPointResponse[];
}