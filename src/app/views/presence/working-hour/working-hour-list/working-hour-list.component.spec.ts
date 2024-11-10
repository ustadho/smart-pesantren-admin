import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHourListComponent } from './working-hour-list.component';

describe('WorkingHourListComponent', () => {
  let component: WorkingHourListComponent;
  let fixture: ComponentFixture<WorkingHourListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkingHourListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkingHourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
