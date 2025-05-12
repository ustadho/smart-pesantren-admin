import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesmentEditComponent } from './assesment-edit.component';

describe('AssesmentEditComponent', () => {
  let component: AssesmentEditComponent;
  let fixture: ComponentFixture<AssesmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesmentEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssesmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
