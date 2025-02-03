import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTimeCopyComponent } from './activity-time-copy.component';

describe('ActivityTimeCopyComponent', () => {
  let component: ActivityTimeCopyComponent;
  let fixture: ComponentFixture<ActivityTimeCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityTimeCopyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityTimeCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
