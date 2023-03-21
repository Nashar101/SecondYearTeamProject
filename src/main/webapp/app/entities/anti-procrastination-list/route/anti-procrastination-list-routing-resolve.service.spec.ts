import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAntiProcrastinationList } from '../anti-procrastination-list.model';
import { AntiProcrastinationListService } from '../service/anti-procrastination-list.service';

import { AntiProcrastinationListRoutingResolveService } from './anti-procrastination-list-routing-resolve.service';

describe('AntiProcrastinationList routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AntiProcrastinationListRoutingResolveService;
  let service: AntiProcrastinationListService;
  let resultAntiProcrastinationList: IAntiProcrastinationList | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(AntiProcrastinationListRoutingResolveService);
    service = TestBed.inject(AntiProcrastinationListService);
    resultAntiProcrastinationList = undefined;
  });

  describe('resolve', () => {
    it('should return IAntiProcrastinationList returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAntiProcrastinationList = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAntiProcrastinationList).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAntiProcrastinationList = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAntiProcrastinationList).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IAntiProcrastinationList>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAntiProcrastinationList = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAntiProcrastinationList).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
