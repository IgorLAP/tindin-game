type Genre = 'Fight' | 'Sports' | 'Survival' | 'Horror' | 'RPG' | 'Fps' | 'Tps' | 'Platform' | 'Adventure' | 'Action' | 'Minigame' | 'Racing' | 'Strategy' | 'Musical' | 'Dance' | 'Simulator';

type Platform = 'PS' | 'PS2' | 'PS3' | 'PS4' | 'PS5' | 'PSP' | 'XBOX' | 'XBOX 360' | 'XBOX ONE' | 'XBOX SERIES S' | 'XBOX' | 'SERIES X' | 'SUPER NINTENDO' | 'NINTENDO 64' | 'NINTENDO SWITCH' | 'NINTENDO WII' | 'NINTENDO DS' | 'NINTENDO 3DS' | 'MEGA DRIVE' | 'PC' | 'MOBILE'

export interface Game {
  _id: string;
  title: string;
  description: string;
  resume?: string;
  launchDate?: Date;
  highlight: boolean;
  rating?: number;
  totalVotes?: number;
  photos: {
    name: string;
    url: string
  }[] | [];
  videos: {
    type: 'TRAILER' | 'GAMEPLAY' | 'CUSTOM';
    url: string;
  }[] | [];
  mediumPrice?: number;
  releaseYear?: number;
  genres?: Genre[];
  platforms?: Platform[];
  tags?: string[];
}
