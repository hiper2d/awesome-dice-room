import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSeatComponent } from './player-seat.component';

describe('PlayerSeatComponent', () => {
  let component: PlayerSeatComponent;
  let fixture: ComponentFixture<PlayerSeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerSeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
