import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalaqohMappingEditComponent } from './halaqoh-mapping-edit.component';

describe('ClassRoomStudentComponent', () => {
  let component: HalaqohMappingEditComponent;
  let fixture: ComponentFixture<HalaqohMappingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalaqohMappingEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HalaqohMappingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
