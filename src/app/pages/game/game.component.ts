import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { gameExhibitionFormatter } from 'src/app/helpers/gameExhibitionFormatter';

import { Game } from 'src/app/interfaces/Game';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @ViewChild('imgSpotlight') imgSpotlight!: ElementRef
  @ViewChild('selectVote') selectVote!: ElementRef
  game!: Game
  inSpotlight = false

  constructor(
    private activedRoute: ActivatedRoute,
    private gameService: GameService,
    private toast: ToastrService,
    private route: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    const id = this.activedRoute.snapshot.params['id']
    this.gameService.getGame(id)
      .subscribe({
        next: (response) => {
          const formattedGame = gameExhibitionFormatter(response)
          this.game = formattedGame
        },
        error: (err) => {
          this.toast.error(err.error.message, 'Something went wrong')
        }
      })
  }

  slideImages(url: string) {
    this.imgSpotlight.nativeElement.src = url
    this.inSpotlight = true
  }

  putOnSpotlight() {
    if (this.game.photos.length > 1) {
      this.inSpotlight = true
    }
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

}
