import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobLevelListComponent } from './job-level-list.component';

describe('JobLevelListComponent', () => {
  let component: JobLevelListComponent;
  let fixture: ComponentFixture<JobLevelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobLevelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobLevelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
