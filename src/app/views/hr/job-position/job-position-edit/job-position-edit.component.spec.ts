import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPositionEditComponent } from './job-position-edit.component';

describe('JobPositionEditComponent', () => {
  let component: JobPositionEditComponent;
  let fixture: ComponentFixture<JobPositionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPositionEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPositionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
