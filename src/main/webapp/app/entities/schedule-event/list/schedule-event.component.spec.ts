import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ScheduleEventService } from '../service/schedule-event.service';

import { ScheduleEventComponent } from './schedule-event.component';

describe('ScheduleEvent Management Component', () => {
  let comp: ScheduleEventComponent;
  let fixture: ComponentFixture<ScheduleEventComponent>;
  let service: ScheduleEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'schedule-event', component: ScheduleEventComponent }]), HttpClientTestingModule],
      declarations: [ScheduleEventComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ScheduleEventComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScheduleEventComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ScheduleEventService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.scheduleEvents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to scheduleEventService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getScheduleEventIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getScheduleEventIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
