import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumListComponent } from './curriculum-list.component';

describe('CurriculumListComponent', () => {
  let component: CurriculumListComponent;
  let fixture: ComponentFixture<CurriculumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurriculumListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurriculumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
