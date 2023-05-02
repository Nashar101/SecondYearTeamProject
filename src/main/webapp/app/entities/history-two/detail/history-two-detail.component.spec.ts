import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HistoryTwoDetailComponent } from './history-two-detail.component';

describe('HistoryTwo Management Detail Component', () => {
  let comp: HistoryTwoDetailComponent;
  let fixture: ComponentFixture<HistoryTwoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryTwoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ historyTwo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HistoryTwoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HistoryTwoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load historyTwo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.historyTwo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
