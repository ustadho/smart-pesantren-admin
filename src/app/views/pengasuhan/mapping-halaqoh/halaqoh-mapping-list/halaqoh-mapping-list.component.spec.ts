import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalaqohMappingListComponent } from './halaqoh-mapping-list.component';

describe('MappingAsramaListComponent', () => {
  let component: HalaqohMappingListComponent;
  let fixture: ComponentFixture<HalaqohMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalaqohMappingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HalaqohMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
