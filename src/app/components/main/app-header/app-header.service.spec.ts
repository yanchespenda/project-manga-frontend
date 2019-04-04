import { TestBed } from '@angular/core/testing';

import { AppHeaderService } from './app-header.service';

describe('AppHeaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppHeaderService = TestBed.get(AppHeaderService);
    expect(service).toBeTruthy();
  });
});
