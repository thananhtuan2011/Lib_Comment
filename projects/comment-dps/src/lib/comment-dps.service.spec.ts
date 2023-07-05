import { TestBed } from '@angular/core/testing';

import { CommentDpsService } from './comment-dps.service';

describe('CommentDpsService', () => {
  let service: CommentDpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentDpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
