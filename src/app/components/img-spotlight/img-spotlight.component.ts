import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { filter, distinctUntilChanged, fromEvent } from 'rxjs';
import SwiperCore, { Navigation, Pagination } from 'swiper'

SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-img-spotlight',
  templateUrl: './img-spotlight.component.html',
  styleUrls: ['./img-spotlight.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImgSpotlightComponent implements OnInit, AfterViewChecked {

  @ViewChild('imgSpotlight') imgSpotlight!: ElementRef
  @ViewChild('marginChange') marginChange!: ElementRef
  @ViewChild('urlInput') urlInput!: ElementRef
  @ViewChild('nameInput') nameInput!: ElementRef
  @Input('newGame') newGame!: boolean
  @Input('sliderUrls') sliderUrls!: string[] | SafeResourceUrl[]
  @Output() newMedia = new EventEmitter()
  inSpotlight = false
  marginLeft = 0
  sliderWidth!: string

  //Swiper controls
  spaceBetween = 30
  slidesPerGroup = 1
  slidesPerView = 1

  constructor(
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    fromEvent(window, 'resize')
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
      ).subscribe(() => {
        if (innerWidth < 980 && innerWidth > 619) {
          this.slidesPerGroup = 2
          this.slidesPerView = 2
        }

        if (innerWidth < 620 || innerWidth > 980) {
          this.slidesPerGroup = 1
          this.slidesPerView = 1
        }
      })
  }

  ngAfterViewChecked(): void {
    this.sliderWidth = this.sliderUrls ? `${this.sliderUrls.length * 150}px` : '0px'
    this.cdr.detectChanges()
  }

  validateMedia(url: string) {
    const validExtensions = ['jpg', 'jpeg', 'png', 'youtube.com/watch?']
    if (url.includes(validExtensions[validExtensions.length - 1])) {
      return true
    }

    function reverseString(url: string) {
      return url.split('').reverse().join('')
    }
    const reverseUrlExtension = reverseString(url).split(".")[0]
    const urlExtension = reverseString(reverseUrlExtension)
    for (let i in validExtensions) {
      if (urlExtension.includes(validExtensions[i])) {
        return true
      }
    }
    return false
  }

  isString(type: string | SafeResourceUrl): boolean { return typeof (type) === 'string' }

  emitEventNewMedia(name: string, url: string) {
    const valid = this.validateMedia(url)
    if (name !== '') {
      if (valid) {
        if (name === 'GAMEPLAY' || name === 'TRAILER' || name === 'CUSTOM') {
          this.newMedia.emit({
            type: name,
            url: url.replace('watch?v=', 'embed/')
          })
          this.urlInput.nativeElement.value = ''
          this.nameInput.nativeElement.value = ''
          return;
        }

        this.newMedia.emit({
          name,
          url
        })
        this.urlInput.nativeElement.value = ''
        this.nameInput.nativeElement.value = ''
        return;

      } else {
        this.toast.error('Invalid format', 'Error')
      }
    } else {
      this.toast.error('Name is required for media', 'Error')
    }
  }

  slideImages(url: string | SafeResourceUrl) {
    this.imgSpotlight.nativeElement.src = url
    this.inSpotlight = true
  }

  putOnSpotlight() {
    if (this.sliderUrls.length > 1) {
      this.inSpotlight = true
    }
  }
}
