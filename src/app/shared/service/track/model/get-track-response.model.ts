import { TrackPointResponse } from "./track-point-response.model";

export interface GetTrackResponse {
  id: number;
  creatorId: number;
  userFirstname: string;
  userLastname: string;
  name: string;
  description: string;
  startLongitude: number;
  startLatitude: number;
  averageTime: string;
  trackPoints: TrackPointResponse[];
}