import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPhotoComponent } from './personal-photo.component';

describe('PersonalPhotoComponent', () => {
  let component: PersonalPhotoComponent;
  let fixture: ComponentFixture<PersonalPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalPhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
