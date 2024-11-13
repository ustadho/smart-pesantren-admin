import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassLevelListComponent } from './class-level-list.component';

describe('ClassLevelListComponent', () => {
  let component: ClassLevelListComponent;
  let fixture: ComponentFixture<ClassLevelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassLevelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassLevelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
