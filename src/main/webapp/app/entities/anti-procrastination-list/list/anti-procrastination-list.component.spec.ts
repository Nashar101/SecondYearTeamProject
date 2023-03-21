import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AntiProcrastinationListService } from '../service/anti-procrastination-list.service';

import { AntiProcrastinationListComponent } from './anti-procrastination-list.component';

describe('AntiProcrastinationList Management Component', () => {
  let comp: AntiProcrastinationListComponent;
  let fixture: ComponentFixture<AntiProcrastinationListComponent>;
  let service: AntiProcrastinationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'anti-procrastination-list', component: AntiProcrastinationListComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [AntiProcrastinationListComponent],
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
      .overrideTemplate(AntiProcrastinationListComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AntiProcrastinationListComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AntiProcrastinationListService);

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
    expect(comp.antiProcrastinationLists?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to antiProcrastinationListService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAntiProcrastinationListIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAntiProcrastinationListIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
