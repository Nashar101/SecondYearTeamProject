import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DiaryPageDetailComponent } from './diary-page-detail.component';

describe('DiaryPage Management Detail Component', () => {
  let comp: DiaryPageDetailComponent;
  let fixture: ComponentFixture<DiaryPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiaryPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ diaryPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DiaryPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DiaryPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load diaryPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.diaryPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
