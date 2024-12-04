import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTimeEditComponent } from './activity-time-edit.component';

describe('ActivityTimeEditComponent', () => {
  let component: ActivityTimeEditComponent;
  let fixture: ComponentFixture<ActivityTimeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityTimeEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityTimeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
