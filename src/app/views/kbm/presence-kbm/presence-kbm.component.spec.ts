import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceKbmComponent } from './presence-kbm.component';

describe('PresenceKbmComponent', () => {
  let component: PresenceKbmComponent;
  let fixture: ComponentFixture<PresenceKbmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresenceKbmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresenceKbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
