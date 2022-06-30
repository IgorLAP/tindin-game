import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Game } from 'src/app/interfaces/Game';

@Component({
  selector: 'app-games-area',
  templateUrl: './games-area.component.html',
  styleUrls: ['./games-area.component.scss']
})
export class GamesAreaComponent implements OnInit {

  @Input() gamesList!: Game[]
  @Input() searchList!: Game[] | [] | null
  @Input() moreGames!: boolean
  @Output() viewMoreGames = new EventEmitter()
  paginationDetails = {
    perPage: 4,
    page: 1
  }

  constructor() { }

  ngOnInit(): void {
  }

  handleMoreGames() {
    if (!this.moreGames) {
      this.paginationDetails.page++
      this.viewMoreGames.emit(this.paginationDetails)
    }
  }

}
