import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { gameExhibitionFormatter } from 'src/app/helpers/gameExhibitionFormatter';

import { Game } from 'src/app/interfaces/Game';
import { GameService } from 'src/app/services/game.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @ViewChild('selectVote', { static: false }) selectVote!: ElementRef
  isLogged!: boolean
  game!: Game
  sliderUrls: SafeResourceUrl[] = []

  constructor(
    private activedRoute: ActivatedRoute,
    private gameService: GameService,
    private toast: ToastrService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private domSanitazer: DomSanitizer,
    private authService: AuthService
  ) {
    this.isLogged = this.authService.isLogged
  }

  ngOnInit(): void {
    const id = this.activedRoute.snapshot.params['id']
    this.gameService.getGame(id)
      .subscribe({
        next: (response) => {
          const formattedGame = gameExhibitionFormatter(response)
          this.game = formattedGame
          formattedGame.photos.map(photo => this.sliderUrls.push(photo.url))
          formattedGame.videos.map(video => {
            if (video.url.includes('watch')) {
              const embedUrl = video.url.replace('watch?v=', 'embed/')
              this.sliderUrls.push(this.domSanitazer.bypassSecurityTrustResourceUrl(embedUrl))
            } else {
              this.sliderUrls.push(this.domSanitazer.bypassSecurityTrustResourceUrl(video.url))
            }
          })
        },
        error: (err) => {
          this.toast.error(err.error.message, 'Something went wrong')
        }
      })
  }

  voteNow() {
    if (!this.selectVote.nativeElement.value) {
      this.toast.warning('Rate the game first')
    } else {
      if (confirm('Confirm vote?')) {
        this.spinner.show()
        const data = {
          id: this.activedRoute.snapshot.params['id'],
          rate: Number(this.selectVote.nativeElement.value)
        }
        this.gameService.rateGame(data.id, data.rate)
          .subscribe({
            next: () => {
              this.spinner.hide()
              this.toast.success('Your vote has been counted', 'Thank you')
              this.route.navigateByUrl('/', { skipLocationChange: true })
                .then(() => this.route.navigate([`/game/${data.id}`]))
            },
            error: (err) => {
              this.spinner.hide()
              this.toast.error(`${err.error.message}`, 'Something went wrong')
            }
          })
      }
    }
  }

  handleDeleteGame(gameId: string) {
    if (confirm(`Delete game ${this.game.title}?`)) {
      this.spinner.show()
      this.gameService.deleteGame(gameId)
        .subscribe({
          next: (response) => {
            this.spinner.hide()
            this.toast.show('Successfully deleted', 'Deleted')
            this.route.navigate(['/'])
          },
          error: (err) => {
            this.spinner.hide()
            if (err.error.statusCode == 401) {
              this.toast.error(`${err.error.message}`, "You don't have persmission")
            }

            if (err.error.statusCode == 412) {
              this.toast.error(`${err.error.message}`, "Game not found")
            }

            if (err.status == 500) {
              this.toast.error('Internal Server Error', "Something went wrong")
            }
          }
        })
    }
  }

}
