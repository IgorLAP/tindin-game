import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertEditGameComponent } from './insert-edit-game.component';

describe('InsertEditGameComponent', () => {
  let component: InsertEditGameComponent;
  let fixture: ComponentFixture<InsertEditGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InsertEditGameComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertEditGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
