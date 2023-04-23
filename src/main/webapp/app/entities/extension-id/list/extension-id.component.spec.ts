import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ExtensionIDService } from '../service/extension-id.service';

import { ExtensionIDComponent } from './extension-id.component';

describe('ExtensionID Management Component', () => {
  let comp: ExtensionIDComponent;
  let fixture: ComponentFixture<ExtensionIDComponent>;
  let service: ExtensionIDService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'extension-id', component: ExtensionIDComponent }]), HttpClientTestingModule],
      declarations: [ExtensionIDComponent],
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
      .overrideTemplate(ExtensionIDComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExtensionIDComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExtensionIDService);

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
    expect(comp.extensionIDS?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to extensionIDService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getExtensionIDIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getExtensionIDIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
