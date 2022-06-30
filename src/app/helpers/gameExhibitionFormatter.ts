import { Game } from "../interfaces/Game";

export function gameExhibitionFormatter(game: Game): Game {
  return {
    ...game,
    rating: Number(game.rating?.toFixed(1)),
    photos: game.photos!.length != 0 ? game.photos : [{ name: 'placeholder', url: 'assets/utils/placeholder-poster.png' }],
  }
}
