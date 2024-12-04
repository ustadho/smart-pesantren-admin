import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTimeComponent } from './activity-time.component';

describe('ActivityTimeComponent', () => {
  let component: ActivityTimeComponent;
  let fixture: ComponentFixture<ActivityTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
