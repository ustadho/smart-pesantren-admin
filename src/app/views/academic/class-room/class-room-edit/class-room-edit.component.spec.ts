import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRoomEditComponent } from './class-room-edit.component';

describe('ClassRoomEditComponent', () => {
  let component: ClassRoomEditComponent;
  let fixture: ComponentFixture<ClassRoomEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassRoomEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassRoomEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
