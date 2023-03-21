import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ScheduleEventDetailComponent } from './schedule-event-detail.component';

describe('ScheduleEvent Management Detail Component', () => {
  let comp: ScheduleEventDetailComponent;
  let fixture: ComponentFixture<ScheduleEventDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleEventDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ scheduleEvent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ScheduleEventDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ScheduleEventDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load scheduleEvent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.scheduleEvent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
