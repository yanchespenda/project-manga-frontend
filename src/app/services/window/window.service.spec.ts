import { TestBed } from '@angular/core/testing';

import { WINDOW } from './window.service';

describe('WindowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: any = TestBed.get(WINDOW);
    expect(service).toBeTruthy();
  });
});
