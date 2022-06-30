import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormattedGame } from 'src/app/interfaces/Game';

@Component({
  selector: 'app-games-area',
  templateUrl: './games-area.component.html',
  styleUrls: ['./games-area.component.scss']
})
export class GamesAreaComponent implements OnInit {

  @Input() gamesList!: FormattedGame[]
  @Input() searchList!: FormattedGame[] | [] | null
  @Input() disableBtn!: boolean
  @Output() viewMoreGames = new EventEmitter()
  paginationDetails = {
    perPage: 4,
    page: 1
  }

  constructor() { }

  ngOnInit(): void {
  }

  handleMoreGames() {
    if (!this.disableBtn) {
      this.paginationDetails.page++
      this.viewMoreGames.emit(this.paginationDetails)
    }
  }

}
