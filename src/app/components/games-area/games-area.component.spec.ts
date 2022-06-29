import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesAreaComponent } from './games-area.component';

describe('GamesAreaComponent', () => {
  let component: GamesAreaComponent;
  let fixture: ComponentFixture<GamesAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
