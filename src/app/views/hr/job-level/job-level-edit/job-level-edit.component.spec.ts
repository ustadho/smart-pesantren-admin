import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobLevelEditComponent } from './job-level-edit.component';

describe('JobLevelEditComponent', () => {
  let component: JobLevelEditComponent;
  let fixture: ComponentFixture<JobLevelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobLevelEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobLevelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
