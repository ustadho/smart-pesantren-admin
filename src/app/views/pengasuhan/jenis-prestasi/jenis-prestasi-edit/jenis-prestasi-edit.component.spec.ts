import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPrestasiEditComponent } from './jenis-prestasi-edit.component';

describe('JenisPrestasiEditComponent', () => {
  let component: JenisPrestasiEditComponent;
  let fixture: ComponentFixture<JenisPrestasiEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisPrestasiEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisPrestasiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
