import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { gameExhibitionFormatter } from 'src/app/helpers/gameExhibitionFormatter';

import { Game } from 'src/app/interfaces/Game';
import { GameService } from 'src/app/services/game.service';
import { AuthService } from 'src/app/services/auth.service';
import { returnGameRoutesError } from 'src/app/helpers/returnGameRoutesError';

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
          const { message, name } = returnGameRoutesError(err)
          this.toast.error(message, name)
          this.spinner.hide()
        }
      })
  }

  voteNow() {
    if (!this.selectVote.nativeElement.value) {
      this.toast.warning('Rate the game first')
      return;
    } else {
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
            const { message, name } = returnGameRoutesError(err)
            this.toast.error(message, name)
            this.spinner.hide()
          }
        })
    }
  }

  handleDeleteGame(gameId: string) {
    this.spinner.show()
    this.gameService.deleteGame(gameId)
      .subscribe({
        next: (response) => {
          this.spinner.hide()
          this.toast.success('Successfully deleted', 'Deleted')
          this.route.navigate(['/'])
        },
        error: (err) => {
          const { message, name } = returnGameRoutesError(err)
          this.toast.error(message, name)
          this.spinner.hide()
        }
      })
  }

}
