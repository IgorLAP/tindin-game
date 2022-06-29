type Genres = 'Fight' | 'Sports' | 'Survival' | 'Horror' | 'RPG' | 'Fps' | 'Tps' | 'Platform' | 'Adventure' | 'Action' | 'Minigame' | 'Racing' | 'Strategy' | 'Musical' | 'Dance' | 'Simulator';

type Plataform = 'PS' | 'PS2' | 'PS3' | 'PS4' | 'PS5' | 'PSP' | 'XBOX' | 'XBOX 360' | 'XBOX ONE' | 'XBOX SERIES S' | 'XBOX' | 'SERIES X' | 'SUPER NINTENDO' | 'NINTENDO 64' | 'NINTENDO SWITCH' | 'NINTENDO WII' | 'NINTENDO DS' | 'NINTENDO 3DS' | 'MEGA DRIVE' | 'PC' | 'MOBILE'

export interface Game {
  _id: string;
  title: string;
  description: string;
  rating?: number;
  totalVotes?: number;
  resume?: string;
  photos?: {
    name: string;
    url: string
  }[];
  videos?: {
    type: string;
    url: string;
  }[];
  mediumPrice?: number | string;
  studio?: string;
  company?: string;
  releaseYear?: number;
  genres?: Genres;
  plataforms?: Plataform;
  tags?: string[];
}
