import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTimeComponent } from './working-time.component';

describe('WorkingHourComponent', () => {
  let component: WorkingTimeComponent;
  let fixture: ComponentFixture<WorkingTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
