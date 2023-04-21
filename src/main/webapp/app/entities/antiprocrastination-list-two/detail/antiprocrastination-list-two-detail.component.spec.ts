import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AntiprocrastinationListTwoDetailComponent } from './antiprocrastination-list-two-detail.component';

describe('AntiprocrastinationListTwo Management Detail Component', () => {
  let comp: AntiprocrastinationListTwoDetailComponent;
  let fixture: ComponentFixture<AntiprocrastinationListTwoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AntiprocrastinationListTwoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ antiprocrastinationListTwo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AntiprocrastinationListTwoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AntiprocrastinationListTwoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load antiprocrastinationListTwo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.antiprocrastinationListTwo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
