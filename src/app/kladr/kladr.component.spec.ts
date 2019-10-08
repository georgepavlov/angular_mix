import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KladrComponent } from './kladr.component';

describe('KladrComponent', () => {
  let component: KladrComponent;
  let fixture: ComponentFixture<KladrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KladrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KladrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
