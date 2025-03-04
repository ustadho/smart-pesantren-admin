import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHourDialogComponent } from './working-hour-dialog.component';

describe('WorkingHourDialogComponent', () => {
  let component: WorkingHourDialogComponent;
  let fixture: ComponentFixture<WorkingHourDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingHourDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingHourDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
