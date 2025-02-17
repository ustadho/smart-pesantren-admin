import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSchedule2Component } from './subject-schedule2.component';

describe('SubjectSchedule2Component', () => {
  let component: SubjectSchedule2Component;
  let fixture: ComponentFixture<SubjectSchedule2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectSchedule2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectSchedule2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
