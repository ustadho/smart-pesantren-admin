import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPelanggaranComponent } from './jenis-pelanggaran.component';

describe('SubjectComponent', () => {
  let component: JenisPelanggaranComponent;
  let fixture: ComponentFixture<JenisPelanggaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisPelanggaranComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisPelanggaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
