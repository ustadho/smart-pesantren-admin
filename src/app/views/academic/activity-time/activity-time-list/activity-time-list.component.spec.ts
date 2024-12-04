import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTimeListComponent } from './activity-time-list.component';

describe('ActivityTimeListComponent', () => {
  let component: ActivityTimeListComponent;
  let fixture: ComponentFixture<ActivityTimeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityTimeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityTimeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
