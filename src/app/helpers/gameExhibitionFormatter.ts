import { FormattedGame, Game } from "../interfaces/Game";

export function gameExhibitionFormatter(game: Game): FormattedGame {
  return {
    ...game,
    rating: Number(game.rating?.toFixed(1)),
    photos: game.photos!.length != 0 ? game.photos![0].url : 'assets/utils/placeholder-poster.png',
    mediumPrice: game.mediumPrice
      ? new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' })
        .format(game.mediumPrice as number)
      : 'Price unavailable'
  }
}
