import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDpsComponent } from './comment-dps.component';

describe('CommentDpsComponent', () => {
  let component: CommentDpsComponent;
  let fixture: ComponentFixture<CommentDpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentDpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentDpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
