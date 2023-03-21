import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AlarmDetailComponent } from './alarm-detail.component';

describe('Alarm Management Detail Component', () => {
  let comp: AlarmDetailComponent;
  let fixture: ComponentFixture<AlarmDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlarmDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ alarm: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AlarmDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AlarmDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load alarm on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.alarm).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
