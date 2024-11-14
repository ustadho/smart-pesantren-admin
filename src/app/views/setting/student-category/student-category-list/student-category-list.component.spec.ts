import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCategoryListComponent } from './student-category-list.component';

describe('StudentCategoryListComponent', () => {
  let component: StudentCategoryListComponent;
  let fixture: ComponentFixture<StudentCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
