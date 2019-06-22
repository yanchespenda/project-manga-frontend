import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHeaderMenuComponent } from './app-header-menu.component';

describe('AppHeaderMenuComponent', () => {
  let component: AppHeaderMenuComponent;
  let fixture: ComponentFixture<AppHeaderMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppHeaderMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
