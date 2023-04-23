import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAntiprocrastinationListTwo } from '../antiprocrastination-list-two.model';
import { AntiprocrastinationListTwoService } from '../service/antiprocrastination-list-two.service';

import { AntiprocrastinationListTwoRoutingResolveService } from './antiprocrastination-list-two-routing-resolve.service';

describe('AntiprocrastinationListTwo routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AntiprocrastinationListTwoRoutingResolveService;
  let service: AntiprocrastinationListTwoService;
  let resultAntiprocrastinationListTwo: IAntiprocrastinationListTwo | null | undefined;

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
    routingResolveService = TestBed.inject(AntiprocrastinationListTwoRoutingResolveService);
    service = TestBed.inject(AntiprocrastinationListTwoService);
    resultAntiprocrastinationListTwo = undefined;
  });

  describe('resolve', () => {
    it('should return IAntiprocrastinationListTwo returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAntiprocrastinationListTwo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAntiprocrastinationListTwo).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAntiprocrastinationListTwo = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAntiprocrastinationListTwo).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IAntiprocrastinationListTwo>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAntiprocrastinationListTwo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAntiprocrastinationListTwo).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
