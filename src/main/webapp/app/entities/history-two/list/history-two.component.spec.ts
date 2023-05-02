import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HistoryTwoService } from '../service/history-two.service';

import { HistoryTwoComponent } from './history-two.component';

describe('HistoryTwo Management Component', () => {
  let comp: HistoryTwoComponent;
  let fixture: ComponentFixture<HistoryTwoComponent>;
  let service: HistoryTwoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'history-two', component: HistoryTwoComponent }]), HttpClientTestingModule],
      declarations: [HistoryTwoComponent],
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
      .overrideTemplate(HistoryTwoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistoryTwoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(HistoryTwoService);

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
    expect(comp.historyTwos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to historyTwoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getHistoryTwoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getHistoryTwoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
