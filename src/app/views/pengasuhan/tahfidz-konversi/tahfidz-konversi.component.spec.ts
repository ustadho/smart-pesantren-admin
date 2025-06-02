import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TahfidzKonversiComponent } from './tahfidz-konversi.component';

describe('TahfidzKonversiComponent', () => {
  let component: TahfidzKonversiComponent;
  let fixture: ComponentFixture<TahfidzKonversiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TahfidzKonversiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TahfidzKonversiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
