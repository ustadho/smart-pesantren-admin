import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCategoryComponent } from './student-category.component';

describe('StudentCategoryComponent', () => {
  let component: StudentCategoryComponent;
  let fixture: ComponentFixture<StudentCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
