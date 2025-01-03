import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TugasKepengasuhanComponent } from './tugas-kepengasuhan.component';

describe('SubjectComponent', () => {
  let component: TugasKepengasuhanComponent;
  let fixture: ComponentFixture<TugasKepengasuhanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TugasKepengasuhanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TugasKepengasuhanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
