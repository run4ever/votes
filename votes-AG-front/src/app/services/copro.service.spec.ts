import { TestBed } from '@angular/core/testing';

import { CoproService } from './copro.service';

describe('CoproService', () => {
  let service: CoproService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoproService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
