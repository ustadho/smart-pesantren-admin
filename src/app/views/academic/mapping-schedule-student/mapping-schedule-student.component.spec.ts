import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingScheduleStudentComponent } from './mapping-schedule-student.component';

describe('MappingScheduleStudentComponent', () => {
  let component: MappingScheduleStudentComponent;
  let fixture: ComponentFixture<MappingScheduleStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MappingScheduleStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappingScheduleStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
