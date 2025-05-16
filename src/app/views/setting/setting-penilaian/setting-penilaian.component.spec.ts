import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPenilaianComponent } from './setting-penilaian.component';

describe('SettingPenilaianComponent', () => {
  let component: SettingPenilaianComponent;
  let fixture: ComponentFixture<SettingPenilaianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingPenilaianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingPenilaianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
