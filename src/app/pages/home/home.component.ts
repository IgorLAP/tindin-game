import { NgxSpinnerService } from 'ngx-spinner';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, DoCheck } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';

import { gameExhibitionFormatter } from 'src/app/helpers/gameExhibitionFormatter';
import { FormattedGame } from 'src/app/interfaces/Game';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, DoCheck {

  @ViewChild('searchInput') searchInput!: ElementRef
  searchList!: FormattedGame[] | [] | null
  isLogged!: boolean
  imagesBanner: { name: string, url: string }[] = [
    { name: 'placeholder0', url: 'assets/banner0.png' }
  ]
  actualSlide = 0
  gamesList!: FormattedGame[]
  disableBtn = false

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.isLogged = this.authService.isLogged
  }

  ngOnInit(): void {
    this.gameService.listGames({})
      .subscribe({
        next: (value) => {
          this.gamesList = value.games.map(game => gameExhibitionFormatter(game))
        },
      })

    this.gameService.listGames({
      paginationDetails: { page: 0, perPage: 0 },
      highlight: true
    }).subscribe(response => {
      response.games.map(game => {
        this.imagesBanner.push({
          name: game.title,
          url: game.photos[0].url
        })
      })
    })
  }

  ngAfterViewInit(): void {
    if (this.isLogged) {
      fromEvent(this.searchInput.nativeElement, 'keyup')
        .pipe(
          filter(Boolean),
          debounceTime(500),
          distinctUntilChanged(),
          tap(() => {
            const query = this.searchInput.nativeElement.value
            if (query) {
              this.gameService.searchGame(query)
                .subscribe(response =>
                  this.searchList = response.map(game => gameExhibitionFormatter(game))
                )
            } else {
              this.searchList = null
            }
          })
        ).subscribe()
    }
  }

  ngDoCheck(): void {
    if (this.isLogged !== this.authService.isLogged) {
      this.isLogged = this.authService.isLogged
    }
  }

  onViewMoreGames(event: { perPage: number, page: number }) {
    this.spinner.show()
    this.gameService.listGames({ paginationDetails: event })
      .subscribe(response => {
        const formattedGame = response.games.map(game => gameExhibitionFormatter(game))
        formattedGame.map(game => {
          return this.gamesList.push(game)
        })
        if (this.gamesList.length === response.totalSize) {
          if (!this.disableBtn) {
            this.disableBtn = true
          }
        }
        this.spinner.hide()
      })
  }
}
