import {
  AfterContentChecked,
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-img-spotlight',
  templateUrl: './img-spotlight.component.html',
  styleUrls: ['./img-spotlight.component.scss']
})
export class ImgSpotlightComponent implements OnInit, AfterViewChecked, AfterContentChecked {

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

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {

  }

  ngAfterContentChecked(): void {
    console.log(this.sliderUrls)
  }

  ngAfterViewChecked(): void {
    this.sliderWidth = this.sliderUrls ? `${this.sliderUrls.length * 150}px` : '0px'
    this.cdr.detectChanges()
  }

  handleGoLeft() {
    if (this.marginLeft < 0) {
      this.marginLeft += 120
      this.renderer.setStyle(this.marginChange.nativeElement, 'marginLeft', `${this.marginLeft}px`)
    }
  }

  handleGoRight() {
    const sliderWidth = Number(this.sliderWidth.split('px')[0])
    this.marginLeft -= 120
    this.renderer.setStyle(this.marginChange.nativeElement, 'marginLeft', `${this.marginLeft}px`)
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
    console.log(reverseUrlExtension, urlExtension)
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
