import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgSpotlightComponent } from './img-spotlight.component';

describe('ImgSpotlightComponent', () => {
  let component: ImgSpotlightComponent;
  let fixture: ComponentFixture<ImgSpotlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgSpotlightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImgSpotlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
