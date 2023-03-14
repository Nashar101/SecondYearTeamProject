import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TestingDetailComponent } from './testing-detail.component';

describe('Testing Management Detail Component', () => {
  let comp: TestingDetailComponent;
  let fixture: ComponentFixture<TestingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ testing: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TestingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TestingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load testing on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.testing).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
