import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTransferListComponent } from './employee-transfer-list.component';

describe('EmployeeTransferListComponent', () => {
  let component: EmployeeTransferListComponent;
  let fixture: ComponentFixture<EmployeeTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTransferListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
