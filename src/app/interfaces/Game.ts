import { Genre } from "./Genre";
import { Platform } from "./Platform";

export interface Game {
  _id: string;
  title: string;
  description: string;
  resume?: string;
  launchDate?: Date;
  highlight?: boolean;
  rating?: number;
  totalVotes?: number;
  photos: {
    name?: string;
    url?: string
  }[] | [];
  videos: {
    type?: 'TRAILER' | 'GAMEPLAY' | 'CUSTOM';
    url?: string;
  }[] | [];
  mediumPrice?: number;
  releaseYear?: number;
  genres?: Genre[] | [];
  platforms?: Platform[] | [];
  tags?: string[];
}
