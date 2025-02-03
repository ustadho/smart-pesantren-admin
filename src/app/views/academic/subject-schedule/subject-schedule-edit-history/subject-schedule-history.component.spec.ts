import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectScheduleHistoryComponent } from './subject-schedule-history.component';

describe('SubjectScheduleHistoryComponent', () => {
  let component: SubjectScheduleHistoryComponent;
  let fixture: ComponentFixture<SubjectScheduleHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectScheduleHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectScheduleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
