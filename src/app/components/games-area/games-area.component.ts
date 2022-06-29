import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/interfaces/Game';

@Component({
  selector: 'app-games-area',
  templateUrl: './games-area.component.html',
  styleUrls: ['./games-area.component.scss']
})
export class GamesAreaComponent implements OnInit {

  @Input() gamesList!: Game[]

  constructor() { }

  ngOnInit(): void {
  }

}
