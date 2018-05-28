import { TestBed, inject } from '@angular/core/testing';

import { DropexService } from './dropex.service';

describe('DropexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropexService]
    });
  });

  it('should be created', inject([DropexService], (service: DropexService) => {
    expect(service).toBeTruthy();
  }));
});
