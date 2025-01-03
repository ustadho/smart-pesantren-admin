import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPrestasiComponent as JenisPrestasiComponent } from './jenis-prestasi.component';

describe('SubjectComponent', () => {
  let component: JenisPrestasiComponent;
  let fixture: ComponentFixture<JenisPrestasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisPrestasiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisPrestasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
