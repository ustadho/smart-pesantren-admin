import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPelanggaranListComponent } from './jenis-pelanggaran-list.component';

describe('JenisPelanggaranListComponent', () => {
  let component: JenisPelanggaranListComponent;
  let fixture: ComponentFixture<JenisPelanggaranListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisPelanggaranListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisPelanggaranListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
