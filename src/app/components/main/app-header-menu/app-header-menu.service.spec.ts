import { TestBed } from '@angular/core/testing';

import { AppHeaderMenuService } from './app-header-menu.service';

describe('AppHeaderMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppHeaderMenuService = TestBed.get(AppHeaderMenuService);
    expect(service).toBeTruthy();
  });
});
