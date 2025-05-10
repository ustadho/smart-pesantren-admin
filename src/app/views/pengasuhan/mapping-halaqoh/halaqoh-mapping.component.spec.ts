import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalaqohMappingComponent } from './halaqoh-mapping.component';

describe('MappingAsramaComponent', () => {
  let component: HalaqohMappingComponent;
  let fixture: ComponentFixture<HalaqohMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalaqohMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HalaqohMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
