import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, DoCheck } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';

import { gameExhibitionFormatter } from 'src/app/helpers/gameExhibitionFormatter';
import { Game } from 'src/app/interfaces/Game';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, DoCheck {

  @ViewChild('searchInput') searchInput!: ElementRef
  searchList!: Game[] | [] | null
  isLogged!: boolean
  imagesBanner: { name: string, url: string }[] = [
    { name: '', url: 'assets/banner0.png' }
  ]
  actualSlide = 0
  gamesList!: Game[]
  hasMoreGames = false

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {
    this.isLogged = this.authService.isLogged
  }

  ngOnInit(): void {
    this.spinner.show()
    this.gameService.listGames({})
      .subscribe({
        next: (value) => {
          this.spinner.hide()
          this.gamesList = value.games.map(game => gameExhibitionFormatter(game))
        },
        error: (err) => {
          this.spinner.hide()
          this.toast.error(err.errors.message, 'Something went wrong')
        }
      })

    this.gameService.listGames({
      paginationDetails: { page: 0, perPage: 0 },
      highlight: true
    }).subscribe({
      next: (response) => {
        this.imagesBanner.pop()
        response.games.map(game => {
          this.imagesBanner.push({
            name: game.title,
            url: game.photos[0].url
          })
        })
      },
      error: (err) => {
        this.toast.error(err.errors.message, 'Problem with banner images')
      }
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
          if (!this.hasMoreGames) {
            this.hasMoreGames = true
          }
        }
        this.spinner.hide()
      })
  }
}
