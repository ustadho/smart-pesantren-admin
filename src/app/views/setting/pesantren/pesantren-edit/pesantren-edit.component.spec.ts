import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesantrenEditComponent } from './pesantren-edit.component';

describe('PesantrenEditComponent', () => {
  let component: PesantrenEditComponent;
  let fixture: ComponentFixture<PesantrenEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesantrenEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PesantrenEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
