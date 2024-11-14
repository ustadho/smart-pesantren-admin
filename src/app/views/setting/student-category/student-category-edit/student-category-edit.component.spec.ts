import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCategoryEditComponent } from './student-category-edit.component';

describe('StudentCategoryEditComponent', () => {
  let component: StudentCategoryEditComponent;
  let fixture: ComponentFixture<StudentCategoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCategoryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
