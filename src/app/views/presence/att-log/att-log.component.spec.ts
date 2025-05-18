import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttLogComponent } from './att-log.component';

describe('AttLogComponent', () => {
  let component: AttLogComponent;
  let fixture: ComponentFixture<AttLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
