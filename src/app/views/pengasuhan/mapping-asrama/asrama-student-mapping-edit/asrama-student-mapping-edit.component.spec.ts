import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsramaStudentMappingEditComponent } from './asrama-student-mapping-edit.component';

describe('ClassRoomStudentComponent', () => {
  let component: AsramaStudentMappingEditComponent;
  let fixture: ComponentFixture<AsramaStudentMappingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsramaStudentMappingEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsramaStudentMappingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
