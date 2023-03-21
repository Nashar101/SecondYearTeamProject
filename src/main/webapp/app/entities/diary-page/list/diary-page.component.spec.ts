import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DiaryPageService } from '../service/diary-page.service';

import { DiaryPageComponent } from './diary-page.component';

describe('DiaryPage Management Component', () => {
  let comp: DiaryPageComponent;
  let fixture: ComponentFixture<DiaryPageComponent>;
  let service: DiaryPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'diary-page', component: DiaryPageComponent }]), HttpClientTestingModule],
      declarations: [DiaryPageComponent],
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
      .overrideTemplate(DiaryPageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiaryPageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DiaryPageService);

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
    expect(comp.diaryPages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to diaryPageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDiaryPageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDiaryPageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
