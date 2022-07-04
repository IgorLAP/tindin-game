import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

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

  selectVoteRef!: ElementRef<HTMLSelectElement>
  @ViewChild('selectVote') set selectRef(elRef: ElementRef<HTMLSelectElement>) {
    if (elRef) {
      this.selectVoteRef = elRef
    }
  }
  isLogged!: boolean
  game!: Game
  sliderUrls: string[] = []

  constructor(
    private activedRoute: ActivatedRoute,
    private gameService: GameService,
    private toast: ToastrService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {
    this.isLogged = this.authService.isLogged
  }

  ngOnInit(): void {
    this.spinner.show()
    const id = this.activedRoute.snapshot.params['id']
    this.gameService.getGame(id)
      .subscribe({
        next: (response) => {
          this.game = response
          response.photos.map(
            photo => this.sliderUrls.push(photo.url)
          )
          response.videos.map(video => {
            const videoUrlTypes = ['/embed/', 'watch?v=']
            for (let i in videoUrlTypes) {
              if (video.url.includes(videoUrlTypes[i])) {
                this.sliderUrls.push(video.url.split(videoUrlTypes[i])[1])
              }
            }
          })
          this.spinner.hide()
        },
        error: (err) => {
          const { message, name } = returnGameRoutesError(err)
          this.toast.error(message, name)
          this.spinner.hide()
        }
      })
  }

  voteNow() {
    if (!this.selectVoteRef.nativeElement.value) {
      this.toast.warning('Rate the game first')
      return;
    } else {
      this.spinner.show()
      const data = {
        id: this.activedRoute.snapshot.params['id'],
        rate: Number(this.selectVoteRef.nativeElement.value)
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
