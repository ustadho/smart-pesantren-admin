import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectScheduleEditDialog2Component } from './subject-schedule-edit-dialog2.component';

describe('SubjectScheduleEditDialog2Component', () => {
  let component: SubjectScheduleEditDialog2Component;
  let fixture: ComponentFixture<SubjectScheduleEditDialog2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectScheduleEditDialog2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectScheduleEditDialog2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
