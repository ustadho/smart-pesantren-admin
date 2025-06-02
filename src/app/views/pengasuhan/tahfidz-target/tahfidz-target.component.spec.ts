import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TahfidzTargetComponent } from './tahfidz-target.component';

describe('TahfidzTargetComponent', () => {
  let component: TahfidzTargetComponent;
  let fixture: ComponentFixture<TahfidzTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TahfidzTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TahfidzTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
