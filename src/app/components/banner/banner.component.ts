import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy {

  @Input() actualSlide: number = 0
  @Input() imagesBanner!: { name: string, url: string }[]
  @ViewChild('imgBanner') imgBanner!: ElementRef
  aliveComponent = true;

  constructor() { }

  ngOnInit(): void {
    timer(0, 5000)
      .pipe(takeWhile(() => this.aliveComponent))
      .subscribe(() => this.handleGoRight())
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
