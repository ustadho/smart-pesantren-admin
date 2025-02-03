import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsramaComponent } from './asrama.component';

describe('LocationComponent', () => {
  let component: AsramaComponent;
  let fixture: ComponentFixture<AsramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsramaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
