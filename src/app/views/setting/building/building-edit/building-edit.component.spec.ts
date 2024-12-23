import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingEditComponent } from './building-edit.component';

describe('LocationEditComponent', () => {
  let component: BuildingEditComponent;
  let fixture: ComponentFixture<BuildingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
