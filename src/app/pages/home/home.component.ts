import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, ElementRef, OnInit, ViewChild, DoCheck } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';

import { gameExhibitionFormatter } from 'src/app/helpers/gameExhibitionFormatter';
import { Game } from 'src/app/interfaces/Game';
import { AuthService } from 'src/app/services/auth.service';
import { GameService } from 'src/app/services/game.service';
import { returnGameRoutesError } from 'src/app/helpers/returnGameRoutesError';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, DoCheck {

  searchInputRef!: ElementRef<HTMLInputElement>
  @ViewChild('searchInput') set inputRef(elRef: ElementRef<HTMLInputElement>) {
    if (elRef) {
      this.searchInputRef = elRef
      fromEvent(this.searchInputRef.nativeElement, 'keyup')
        .pipe(
          filter(Boolean),
          debounceTime(500),
          distinctUntilChanged(),
          tap(() => {
            const query = this.searchInputRef.nativeElement.value
            if (query) {
              this.gameService.searchGame(query)
                .subscribe(response => {
                  this.searchList = response.map(game => gameExhibitionFormatter(game))
                })
            } else {
              this.searchList = null
            }
          })
        ).subscribe()
    }
  }
  searchList!: Game[] | [] | null
  isLogged!: boolean
  imagesBanner: { name: string, url: string }[] = [
    { name: '', url: 'assets/banner0.jpg' }
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
          const { message, name } = returnGameRoutesError(err)
          this.toast.error(message, name)
          this.spinner.hide()
        }
      })

    this.gameService.listGames({
      paginationDetails: { page: 0, perPage: 0 },
      highlight: true
    }).subscribe({
      next: (response) => {
        this.imagesBanner.pop()
        for (let i in response.games) {
          if (Number(i) < 3) {
            this.imagesBanner.push({
              name: response.games[i].title,
              url: response.games[i].photos[0].url
            })
          } else {
            break;
          }
        }
      },
      error: (err) => {
        const { message, name } = returnGameRoutesError(err)
        this.toast.error(message, name)
        this.spinner.hide()
      }
    })
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
