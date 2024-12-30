import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesantrenListComponent } from './pesantren-list.component';

describe('PesantrenListComponent', () => {
  let component: PesantrenListComponent;
  let fixture: ComponentFixture<PesantrenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesantrenListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PesantrenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
