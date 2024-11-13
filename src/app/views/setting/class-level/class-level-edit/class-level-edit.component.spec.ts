import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassLevelEditComponent } from './class-level-edit.component';

describe('ClassLevelEditComponent', () => {
  let component: ClassLevelEditComponent;
  let fixture: ComponentFixture<ClassLevelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassLevelEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassLevelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
