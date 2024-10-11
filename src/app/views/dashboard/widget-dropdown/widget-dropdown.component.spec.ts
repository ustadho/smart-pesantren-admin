import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDropdownComponent } from './widget-dropdown.component';

describe('WidgetDropdownComponent', () => {
  let component: WidgetDropdownComponent;
  let fixture: ComponentFixture<WidgetDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
