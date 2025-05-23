import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicYearListComponent } from './academic-year-list.component';

describe('AcademicYearListComponent', () => {
  let component: AcademicYearListComponent;
  let fixture: ComponentFixture<AcademicYearListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicYearListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicYearListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
