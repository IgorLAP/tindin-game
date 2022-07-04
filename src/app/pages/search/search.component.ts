import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';

import { Game } from 'src/app/interfaces/Game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  gamesList$!: Observable<Game[]>

  constructor(
    private activedRoute: ActivatedRoute,
    private gameService: GameService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show()
    this.activedRoute.queryParams
      .subscribe({
        next: (params) => {
          const { q } = params
          this.gamesList$ = this.gameService.searchGame(q)
          this.spinner.hide()
        }
      })
  }

}
