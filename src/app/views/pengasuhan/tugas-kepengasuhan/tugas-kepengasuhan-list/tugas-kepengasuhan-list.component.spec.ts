import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TugasKepengasuhanListComponent } from './tugas-kepengasuhan-list.component';

describe('SubjectListComponent', () => {
  let component: TugasKepengasuhanListComponent;
  let fixture: ComponentFixture<TugasKepengasuhanListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TugasKepengasuhanListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TugasKepengasuhanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
