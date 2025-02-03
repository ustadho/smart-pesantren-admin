import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPelanggaranEditComponent } from './jenis-pelanggaran-edit.component';

describe('JenisPelanggaranEditComponent', () => {
  let component: JenisPelanggaranEditComponent;
  let fixture: ComponentFixture<JenisPelanggaranEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisPelanggaranEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisPelanggaranEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
