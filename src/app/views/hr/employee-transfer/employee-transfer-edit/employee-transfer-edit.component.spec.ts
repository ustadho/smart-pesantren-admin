import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTransferEditComponent } from './employee-transfer-edit.component';

describe('EmployeeTransferEditComponent', () => {
  let component: EmployeeTransferEditComponent;
  let fixture: ComponentFixture<EmployeeTransferEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTransferEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTransferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
