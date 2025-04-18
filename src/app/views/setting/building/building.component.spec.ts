import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingComponent } from './building.component';

describe('LocationComponent', () => {
  let component: BuildingComponent;
  let fixture: ComponentFixture<BuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
