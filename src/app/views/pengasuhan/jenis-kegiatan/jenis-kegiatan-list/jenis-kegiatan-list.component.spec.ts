import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisKegiatanListComponent } from './jenis-kegiatan-list.component';

describe('SubjectListComponent', () => {
  let component: JenisKegiatanListComponent;
  let fixture: ComponentFixture<JenisKegiatanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisKegiatanListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisKegiatanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
