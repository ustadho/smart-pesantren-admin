import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardianPanelComponent } from './guardian-panel.component';

describe('GuardianPanelComponent', () => {
  let component: GuardianPanelComponent;
  let fixture: ComponentFixture<GuardianPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardianPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardianPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
