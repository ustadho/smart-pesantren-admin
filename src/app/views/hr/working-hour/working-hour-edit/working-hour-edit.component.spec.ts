import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHourEditComponent } from './working-hour-edit.component';

describe('WorkingHourEditComponent', () => {
  let component: WorkingHourEditComponent;
  let fixture: ComponentFixture<WorkingHourEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingHourEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingHourEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
