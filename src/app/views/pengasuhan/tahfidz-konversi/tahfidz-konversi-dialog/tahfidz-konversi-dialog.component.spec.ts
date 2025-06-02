import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TahfidzKonversiDialogComponent } from './tahfidz-konversi-dialog.component';

describe('TahfidzKonversiDialogComponent', () => {
  let component: TahfidzKonversiDialogComponent;
  let fixture: ComponentFixture<TahfidzKonversiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TahfidzKonversiDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TahfidzKonversiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
