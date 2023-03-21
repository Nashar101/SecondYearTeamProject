import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IScheduleEvent } from '../schedule-event.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../schedule-event.test-samples';

import { ScheduleEventService, RestScheduleEvent } from './schedule-event.service';

const requireRestSample: RestScheduleEvent = {
  ...sampleWithRequiredData,
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('ScheduleEvent Service', () => {
  let service: ScheduleEventService;
  let httpMock: HttpTestingController;
  let expectedResult: IScheduleEvent | IScheduleEvent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ScheduleEventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ScheduleEvent', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const scheduleEvent = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(scheduleEvent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ScheduleEvent', () => {
      const scheduleEvent = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(scheduleEvent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ScheduleEvent', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ScheduleEvent', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ScheduleEvent', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addScheduleEventToCollectionIfMissing', () => {
      it('should add a ScheduleEvent to an empty array', () => {
        const scheduleEvent: IScheduleEvent = sampleWithRequiredData;
        expectedResult = service.addScheduleEventToCollectionIfMissing([], scheduleEvent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(scheduleEvent);
      });

      it('should not add a ScheduleEvent to an array that contains it', () => {
        const scheduleEvent: IScheduleEvent = sampleWithRequiredData;
        const scheduleEventCollection: IScheduleEvent[] = [
          {
            ...scheduleEvent,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addScheduleEventToCollectionIfMissing(scheduleEventCollection, scheduleEvent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ScheduleEvent to an array that doesn't contain it", () => {
        const scheduleEvent: IScheduleEvent = sampleWithRequiredData;
        const scheduleEventCollection: IScheduleEvent[] = [sampleWithPartialData];
        expectedResult = service.addScheduleEventToCollectionIfMissing(scheduleEventCollection, scheduleEvent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(scheduleEvent);
      });

      it('should add only unique ScheduleEvent to an array', () => {
        const scheduleEventArray: IScheduleEvent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const scheduleEventCollection: IScheduleEvent[] = [sampleWithRequiredData];
        expectedResult = service.addScheduleEventToCollectionIfMissing(scheduleEventCollection, ...scheduleEventArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const scheduleEvent: IScheduleEvent = sampleWithRequiredData;
        const scheduleEvent2: IScheduleEvent = sampleWithPartialData;
        expectedResult = service.addScheduleEventToCollectionIfMissing([], scheduleEvent, scheduleEvent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(scheduleEvent);
        expect(expectedResult).toContain(scheduleEvent2);
      });

      it('should accept null and undefined values', () => {
        const scheduleEvent: IScheduleEvent = sampleWithRequiredData;
        expectedResult = service.addScheduleEventToCollectionIfMissing([], null, scheduleEvent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(scheduleEvent);
      });

      it('should return initial array if no ScheduleEvent is added', () => {
        const scheduleEventCollection: IScheduleEvent[] = [sampleWithRequiredData];
        expectedResult = service.addScheduleEventToCollectionIfMissing(scheduleEventCollection, undefined, null);
        expect(expectedResult).toEqual(scheduleEventCollection);
      });
    });

    describe('compareScheduleEvent', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareScheduleEvent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareScheduleEvent(entity1, entity2);
        const compareResult2 = service.compareScheduleEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareScheduleEvent(entity1, entity2);
        const compareResult2 = service.compareScheduleEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareScheduleEvent(entity1, entity2);
        const compareResult2 = service.compareScheduleEvent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
