
export interface GetTracksResponseTrack { 
  id: number;
  creatorId: number;
  userFirstname: string;
  userLastname: string;
  name: string;
  startLongitude: number;
  startLatitude: number;
  averageTime: string;
  privacy: 'public' | 'private';
 }