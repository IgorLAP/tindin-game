import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Genre } from 'src/app/interfaces/Genre';
import { AuthService } from 'src/app/services/auth.service';

import { GameService } from 'src/app/services/game.service';
import { Platform } from '../../interfaces/Platform';

interface MediaTypes {
  name?: string;
  type?: 'TRAILER' | 'GAMEPLAY' | 'CUSTOM';
  url: string;
}

@Component({
  selector: 'app-insert-edit-game',
  templateUrl: './insert-edit-game.component.html',
  styleUrls: ['./insert-edit-game.component.scss']
})
export class InsertEditGameComponent implements OnInit {

  @ViewChild('tagInput') tagInput!: ElementRef
  isLogged!: boolean
  _id!: string
  title = ''
  resume = ''
  genres = {
    Fight: false,
    Sports: false,
    Survival: false,
    Horror: false,
    RPG: false,
    Fps: false,
    Tps: false,
    Platform: false,
    Adventure: false,
    Action: false,
    Minigame: false,
    Racing: false,
    Strategy: false,
    Musical: false,
    Dance: false,
    Simulator: false,
  }
  platforms = {
    PS: false,
    PS2: false,
    PS3: false,
    PS4: false,
    PS5: false,
    PSP: false,
    XBOX: false,
    XBOX_360: false,
    XBOX_ONE: false,
    XBOX_SERIES_S: false,
    SERIES_X: false,
    SUPER_NINTENDO: false,
    NINTENDO_64: false,
    NINTENDO_SWITCH: false,
    NINTENDO_WII: false,
    NINTENDO_DS: false,
    NINTENDO_3DS: false,
    MEGADRIVE: false,
    PC: false,
    MOBILE: false,
  }
  tags: string[] = []
  mediumPrice!: number
  releaseYear!: number
  description = ''
  highlight!: boolean
  photos: { name: string, url: string }[] = []
  videos: { type: 'TRAILER' | 'GAMEPLAY' | 'CUSTOM', url: string }[] = []
  sliderUrls: SafeResourceUrl[] = []

  updateMode = false

  constructor(
    private gameService: GameService,
    private domSanitazer: DomSanitizer,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private authService: AuthService,
    private activedRoute: ActivatedRoute
  ) {
    this.isLogged = this.authService.isLogged
    if (!this.isLogged) this.router.navigate(['/'])
    const id = this.activedRoute.snapshot.params['id']
    if (id) {
      this.spinner.show()
      this.updateMode = true
      this.gameService.getGame(id)
        .subscribe({
          next: (response) => {
            this._id = response._id
            this.title = response.title
            this.description = response.description
            this.releaseYear = response.releaseYear ?? 0
            this.mediumPrice = response.mediumPrice ?? 0
            this.spinner.hide()
          },
          error: (err) => {

          }
        })
    }
  }

  ngOnInit(): void {
  }

  checkChosenFields(values: { [keyname: string]: any }) {
    let chosenFields: string[] = []
    let genres: Genre[] = []
    let platforms: Platform[] = []

    Object.values(values)
      .forEach((item, index) => {
        if (item === true) {
          chosenFields.push(Object.keys(values)[index])
        }
      })

    for (let chosenItem of chosenFields) {
      for (let genreItem of Object.keys(this.genres)) {
        if (chosenItem === genreItem) {
          genres.push(chosenItem as Genre)
        }
      }
    }

    for (let chosenItem of chosenFields) {
      for (let platformItem of Object.keys(this.platforms)) {
        if (chosenItem === platformItem) {
          platforms.push(chosenItem.replace('_', ' ') as Platform)
        }
      }
    }
    return {
      genres,
      platforms
    }
  }

  handleSubmit(form: NgForm) {
    const { genres, platforms } = this.checkChosenFields(form.form.value)
    const { title, resume, mediumPrice, releaseYear, description } = form.form.value
    // validações
    this.spinner.show()
    const newGame = {
      genres, platforms, title: this.title, resume: this.resume, mediumPrice: this.mediumPrice,
      releaseYear: this.releaseYear, description: this.description, tags: this.tags,
      photos: this.photos, videos: this.videos, highlight: this.highlight
    }
    this.gameService.insertGame(newGame)
      .subscribe({
        next: (response) => {
          this.spinner.hide()
          this.toast.success(`Successfully created`, 'Created')
          this.router.navigate(['/'])
        },
        error: (err) => {
          this.spinner.hide()
          this.toast.error(err.error.message, 'Something went wrong')
        }
      })
  }

  handleUpdate() {
    const data = {
      _id: this._id,
      description: this.description,
      releaseYear: this.releaseYear,
      mediumPrice: this.mediumPrice,
    }
    //validations
    this.spinner.show()
    this.gameService.updateGame(data)
      .subscribe({
        next: (response) => {
          this.spinner.hide()
          this.toast.success('Success', 'Game updated')
          this.router.navigate([`/game/${this._id}`])
        },
        error: (err) => {
          console.log(err)
          this.spinner.hide()
          this.toast.error('Something went wrong', 'Error')
        }
      })
  }

  handleNewMedia(media: MediaTypes) {
    if (media.type) {
      this.videos.push({
        type: media.type,
        url: media.url
      })
      this.sliderUrls.push(this.domSanitazer.bypassSecurityTrustResourceUrl(media.url))
      return;
    }

    if (media.name) {
      this.photos.push({
        name: media.name,
        url: media.url
      })
      this.sliderUrls.push(media.url)
      return;
    }
  }

  keyPress(tag: string) {
    this.tagInput.nativeElement.value = ''
    this.tags.push(tag)
  }

  removeTag(tag: string) {
    const newTags = this.tags.filter(item => item !== tag)
    this.tags = newTags
  }

}
