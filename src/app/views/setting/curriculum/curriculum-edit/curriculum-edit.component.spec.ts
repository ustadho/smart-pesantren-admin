import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumEditComponent } from './curriculum-edit.component';

describe('CurriculumEditComponent', () => {
  let component: CurriculumEditComponent;
  let fixture: ComponentFixture<CurriculumEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
