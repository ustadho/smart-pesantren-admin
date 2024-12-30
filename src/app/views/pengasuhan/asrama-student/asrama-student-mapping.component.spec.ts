import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsramaStudentMappingComponent } from './asrama-student-mapping.component';

describe('ClassRoomStudentComponent', () => {
  let component: AsramaStudentMappingComponent;
  let fixture: ComponentFixture<AsramaStudentMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsramaStudentMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsramaStudentMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
