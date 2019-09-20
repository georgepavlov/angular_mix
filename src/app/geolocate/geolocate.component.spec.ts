import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeolocateComponent } from './geolocate.component';

describe('GeolocateComponent', () => {
  let component: GeolocateComponent;
  let fixture: ComponentFixture<GeolocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeolocateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeolocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
