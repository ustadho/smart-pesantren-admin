import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKegiatanComponent } from './jenis-kegiatan.component';

describe('SubjectComponent', () => {
  let component: JenisKegiatanComponent;
  let fixture: ComponentFixture<JenisKegiatanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisKegiatanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisKegiatanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
