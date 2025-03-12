import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectScheduleEditDialogComponent } from './subject-schedule-edit-dialog.component';

describe('SubjectScheduleEditDialog2Component', () => {
  let component: SubjectScheduleEditDialogComponent;
  let fixture: ComponentFixture<SubjectScheduleEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectScheduleEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectScheduleEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
