import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, AfterViewInit {

  @Input() actualSlide: number = 0
  @Input() imagesBanner!: { name: string, url: string }[]
  widthBanner!: string

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.widthBanner = `${this.imagesBanner.length * 100}vw`
  }

  goLeft() {
    if (this.actualSlide === 0) {
      this.actualSlide = this.imagesBanner.length - 1
    } else {
      this.actualSlide -= 1
    }
  }

  goRight() {
    if (this.actualSlide === this.imagesBanner.length - 1) {
      this.actualSlide = 0
    } else {
      this.actualSlide += 1
    }
  }

}
