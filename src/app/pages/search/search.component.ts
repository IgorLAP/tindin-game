import { Game } from 'src/app/interfaces/Game';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  gamesList$!: Observable<Game[]>

  constructor(
    private activedRoute: ActivatedRoute,
    private gameService: GameService) { }

  ngOnInit(): void {
    this.activedRoute.queryParams
      .subscribe({
        next: (params) => {
          const { q } = params
          this.gamesList$ = this.gameService.searchGame(q)
        }
      })
  }

}
