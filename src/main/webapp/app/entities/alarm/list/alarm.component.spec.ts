import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AlarmService } from '../service/alarm.service';

import { AlarmComponent } from './alarm.component';

describe('Alarm Management Component', () => {
  let comp: AlarmComponent;
  let fixture: ComponentFixture<AlarmComponent>;
  let service: AlarmService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'alarm', component: AlarmComponent }]), HttpClientTestingModule],
      declarations: [AlarmComponent],
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
      .overrideTemplate(AlarmComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlarmComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AlarmService);

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
    expect(comp.alarms?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to alarmService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAlarmIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAlarmIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
