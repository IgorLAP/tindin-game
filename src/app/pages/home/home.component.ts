import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, ElementRef, OnInit, ViewChild, DoCheck } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, tap } from 'rxjs';

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
      this.handleSearch()
    }
  }
  searchList!: Game[] | [] | null
  isLogged!: boolean
  imagesBanner: { name: string, url: string, _id: string }[] = [
    { name: '', url: 'assets/banner0.jpg', _id: '' }
  ]
  actualSlide = 0
  gamesList!: Game[]
  hasMoreGames = false
  onSearch = false
  showGoUpBtn = false

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
        next: (response) => {
          this.spinner.hide()
          this.gamesList = response.games
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
          const actualGame = response.games[i]
          if (actualGame.photos[0].url) {
            if (Number(i) < 3) {
              this.imagesBanner.push({
                name: actualGame.title,
                url: actualGame.photos[0].url,
                _id: actualGame._id
              })
            } else {
              break;
            }
          }
        }
      },
      error: (err) => {
        const { message, name } = returnGameRoutesError(err)
        this.toast.error(message, name)
        this.spinner.hide()
      }
    })

    this.setScrollEvent()
  }

  ngDoCheck(): void {
    if (this.isLogged !== this.authService.isLogged) {
      this.isLogged = this.authService.isLogged
    }
  }

  setScrollEvent() {
    fromEvent(window, 'scroll')
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
      ).subscribe(() => {
        if (window.scrollY > 300) this.showGoUpBtn = true
        if (window.scrollY < 300) this.showGoUpBtn = false
      })
  }

  handleGoUp() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  handleSearch() {
    fromEvent(this.searchInputRef.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => {
          this.onSearch = true
          const query = this.searchInputRef.nativeElement.value
          if (query) {
            this.gameService.searchGame(query)
              .subscribe(response => {
                this.searchList = response
                this.onSearch = false
              })
          } else {
            this.searchList = null
            this.onSearch = false
          }
        })
      ).subscribe()
  }

  onViewMoreGames(event: { perPage: number, page: number }) {
    this.spinner.show()
    this.gameService.listGames({ paginationDetails: event })
      .subscribe(response => {
        response.games.map(game => {
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
