import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsramaStudentMappingListComponent } from './asrama-student-mapping-list.component';

describe('MappingAsramaListComponent', () => {
  let component: AsramaStudentMappingListComponent;
  let fixture: ComponentFixture<AsramaStudentMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsramaStudentMappingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsramaStudentMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
