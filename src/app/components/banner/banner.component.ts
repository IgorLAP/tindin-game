import { Component, Input, OnDestroy, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy {

  @Input() actualSlide: number = 0
  @Input() imagesBanner!: { name: string, url: string, _id: string }[]
  aliveComponent = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.aliveComponent = false
  }

  handleGoLeft() {
    if (this.actualSlide === 0) {
      this.actualSlide = this.imagesBanner.length - 1
    } else {
      this.actualSlide -= 1
    }
  }

  handleGoRight() {
    if (this.actualSlide === this.imagesBanner.length - 1) {
      this.actualSlide = 0
    } else {
      this.actualSlide += 1
    }
  }

}
