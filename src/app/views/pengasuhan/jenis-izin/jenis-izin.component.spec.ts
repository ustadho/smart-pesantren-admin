import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisIzinComponent } from './jenis-izin.component';

describe('SubjectComponent', () => {
  let component: JenisIzinComponent;
  let fixture: ComponentFixture<JenisIzinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisIzinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisIzinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
