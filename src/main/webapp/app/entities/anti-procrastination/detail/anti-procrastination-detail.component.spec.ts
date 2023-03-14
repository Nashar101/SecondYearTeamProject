import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AntiProcrastinationDetailComponent } from './anti-procrastination-detail.component';

describe('AntiProcrastination Management Detail Component', () => {
  let comp: AntiProcrastinationDetailComponent;
  let fixture: ComponentFixture<AntiProcrastinationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AntiProcrastinationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ antiProcrastination: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AntiProcrastinationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AntiProcrastinationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load antiProcrastination on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.antiProcrastination).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
