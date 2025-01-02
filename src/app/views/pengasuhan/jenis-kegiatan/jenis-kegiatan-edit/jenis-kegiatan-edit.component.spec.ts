import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKegiatanEditComponent } from './jenis-kegiatan-edit.component';

describe('JenisKegiatanEditComponent', () => {
  let component: JenisKegiatanEditComponent;
  let fixture: ComponentFixture<JenisKegiatanEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisKegiatanEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisKegiatanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
