import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassLevelComponent } from './class-level.component';

describe('ClassLevelComponent', () => {
  let component: ClassLevelComponent;
  let fixture: ComponentFixture<ClassLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
