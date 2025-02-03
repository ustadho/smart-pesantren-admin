import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsramaListComponent } from './asrama-list.component';

describe('LocationListComponent', () => {
  let component: AsramaListComponent;
  let fixture: ComponentFixture<AsramaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsramaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsramaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
