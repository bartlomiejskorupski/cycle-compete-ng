import { TrackPointResponse } from "./track-point-response.model";

export interface GetTracksResponse {
  tracks: { 
    id: number;
    userFirstname: string;
    userLastname: string;
    name: string;
    startLongitude: number;
    startLatitude: number;
    averageTime: Date;
   }[];
}