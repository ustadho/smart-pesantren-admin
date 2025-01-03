import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisPrestasiListComponent } from './jenis-prestasi-list.component';

describe('JenisPrestasiListComponent', () => {
  let component: JenisPrestasiListComponent;
  let fixture: ComponentFixture<JenisPrestasiListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisPrestasiListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisPrestasiListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
