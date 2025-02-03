import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsramaEditComponent } from './asrama-edit.component';

describe('LocationEditComponent', () => {
  let component: AsramaEditComponent;
  let fixture: ComponentFixture<AsramaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsramaEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsramaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
