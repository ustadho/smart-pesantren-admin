import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TugasKepengasuhanEditComponent } from './tugas-kepengasuhan-edit.component';

describe('TugasKepengasuhanEditComponent', () => {
  let component: TugasKepengasuhanEditComponent;
  let fixture: ComponentFixture<TugasKepengasuhanEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TugasKepengasuhanEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TugasKepengasuhanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
