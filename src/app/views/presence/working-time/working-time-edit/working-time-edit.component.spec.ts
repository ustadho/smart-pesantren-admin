import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTimeEditComponent } from './working-time-edit.component';

describe('WorkingHourEditComponent', () => {
  let component: WorkingTimeEditComponent;
  let fixture: ComponentFixture<WorkingTimeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingTimeEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingTimeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
