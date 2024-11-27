import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRoomStudentComponent } from './class-room-student.component';

describe('ClassRoomStudentComponent', () => {
  let component: ClassRoomStudentComponent;
  let fixture: ComponentFixture<ClassRoomStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassRoomStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassRoomStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
