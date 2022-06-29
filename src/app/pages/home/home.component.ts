import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/interfaces/Game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  imagesBanner: { name: string, url: string }[] = [
    { name: 'placeholder0', url: 'assets/banner0.png' },
    { name: 'placeholder1', url: 'assets/banner1.png' },
    { name: 'placeholder2', url: 'assets/banner2.png' },
  ]
  actualSlide = 0;
  gamesList!: Game[]

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.listGames()
      .subscribe({
        next: (value) => {
          this.gamesList = value.map(game => {
            return {
              ...game,
              rating: Number(game.rating?.toFixed(1)),
              mediumPrice: game.mediumPrice
                ? new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' })
                  .format(game.mediumPrice as number)
                : 'Price unavailable'
            }
          })
        },
      })
  }
}
