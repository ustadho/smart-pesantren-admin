import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesantrenComponent } from './pesantren.component';

describe('PesantrenComponent', () => {
  let component: PesantrenComponent;
  let fixture: ComponentFixture<PesantrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesantrenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PesantrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
