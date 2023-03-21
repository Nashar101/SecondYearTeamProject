import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AntiProcrastinationListDetailComponent } from './anti-procrastination-list-detail.component';

describe('AntiProcrastinationList Management Detail Component', () => {
  let comp: AntiProcrastinationListDetailComponent;
  let fixture: ComponentFixture<AntiProcrastinationListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AntiProcrastinationListDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ antiProcrastinationList: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AntiProcrastinationListDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AntiProcrastinationListDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load antiProcrastinationList on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.antiProcrastinationList).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
