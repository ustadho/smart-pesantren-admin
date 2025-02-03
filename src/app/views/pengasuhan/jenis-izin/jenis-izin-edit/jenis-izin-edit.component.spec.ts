import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisIzinEditComponent } from './jenis-izin-edit.component';

describe('JenisIzinEditComponent', () => {
  let component: JenisIzinEditComponent;
  let fixture: ComponentFixture<JenisIzinEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisIzinEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisIzinEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
