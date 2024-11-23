import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardianEditComponent } from './guardian-edit.component';

describe('GuardianEditComponent', () => {
  let component: GuardianEditComponent;
  let fixture: ComponentFixture<GuardianEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardianEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardianEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
