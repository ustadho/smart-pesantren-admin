import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingDayoffComponent } from './working-dayoff.component';

describe('WorkingDayoffComponent', () => {
  let component: WorkingDayoffComponent;
  let fixture: ComponentFixture<WorkingDayoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingDayoffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingDayoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
