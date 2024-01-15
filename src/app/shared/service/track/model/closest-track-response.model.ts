
export interface ClosestTrackResponse {
  id: number;
  creatorId: number;
  userFirstname: string;
  userLastname: string;
  name: string;
  averageTime: string;
  distanceTo: number;
  privacy: 'public' | 'private';
}