import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupUnmappedStudentComponent } from './lookup-unmapped-student.component';

describe('LookupUnmappedStudentComponent', () => {
  let component: LookupUnmappedStudentComponent;
  let fixture: ComponentFixture<LookupUnmappedStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupUnmappedStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupUnmappedStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
