import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisIzinListComponent } from './jenis-izin-list.component';

describe('SubjectListComponent', () => {
  let component: JenisIzinListComponent;
  let fixture: ComponentFixture<JenisIzinListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisIzinListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisIzinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
