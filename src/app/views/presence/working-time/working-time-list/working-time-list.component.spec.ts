import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTimeListComponent } from './working-time-list.component';

describe('WorkingHourListComponent', () => {
  let component: WorkingTimeListComponent;
  let fixture: ComponentFixture<WorkingTimeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingTimeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingTimeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
