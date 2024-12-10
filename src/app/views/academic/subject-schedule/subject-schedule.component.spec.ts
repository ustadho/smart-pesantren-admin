import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectScheduleComponent } from './subject-schedule.component';

describe('SubjectScheduleComponent', () => {
  let component: SubjectScheduleComponent;
  let fixture: ComponentFixture<SubjectScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
