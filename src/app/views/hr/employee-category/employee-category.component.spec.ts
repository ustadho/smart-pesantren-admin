import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCategoryComponent } from './employee-category.component';

describe('EmployeeCategoryComponent', () => {
  let component: EmployeeCategoryComponent;
  let fixture: ComponentFixture<EmployeeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
