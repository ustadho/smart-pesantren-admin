import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceKbmIzinComponent } from './presence-kbm-izin.component';

describe('PresenceKbmIzinComponent', () => {
  let component: PresenceKbmIzinComponent;
  let fixture: ComponentFixture<PresenceKbmIzinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresenceKbmIzinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresenceKbmIzinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
