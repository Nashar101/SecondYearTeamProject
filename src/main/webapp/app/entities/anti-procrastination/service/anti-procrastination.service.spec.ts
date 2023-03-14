import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAntiProcrastination } from '../anti-procrastination.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../anti-procrastination.test-samples';

import { AntiProcrastinationService } from './anti-procrastination.service';

const requireRestSample: IAntiProcrastination = {
  ...sampleWithRequiredData,
};

describe('AntiProcrastination Service', () => {
  let service: AntiProcrastinationService;
  let httpMock: HttpTestingController;
  let expectedResult: IAntiProcrastination | IAntiProcrastination[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AntiProcrastinationService);
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

    it('should create a AntiProcrastination', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const antiProcrastination = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(antiProcrastination).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AntiProcrastination', () => {
      const antiProcrastination = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(antiProcrastination).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AntiProcrastination', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AntiProcrastination', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AntiProcrastination', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAntiProcrastinationToCollectionIfMissing', () => {
      it('should add a AntiProcrastination to an empty array', () => {
        const antiProcrastination: IAntiProcrastination = sampleWithRequiredData;
        expectedResult = service.addAntiProcrastinationToCollectionIfMissing([], antiProcrastination);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(antiProcrastination);
      });

      it('should not add a AntiProcrastination to an array that contains it', () => {
        const antiProcrastination: IAntiProcrastination = sampleWithRequiredData;
        const antiProcrastinationCollection: IAntiProcrastination[] = [
          {
            ...antiProcrastination,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAntiProcrastinationToCollectionIfMissing(antiProcrastinationCollection, antiProcrastination);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AntiProcrastination to an array that doesn't contain it", () => {
        const antiProcrastination: IAntiProcrastination = sampleWithRequiredData;
        const antiProcrastinationCollection: IAntiProcrastination[] = [sampleWithPartialData];
        expectedResult = service.addAntiProcrastinationToCollectionIfMissing(antiProcrastinationCollection, antiProcrastination);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(antiProcrastination);
      });

      it('should add only unique AntiProcrastination to an array', () => {
        const antiProcrastinationArray: IAntiProcrastination[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const antiProcrastinationCollection: IAntiProcrastination[] = [sampleWithRequiredData];
        expectedResult = service.addAntiProcrastinationToCollectionIfMissing(antiProcrastinationCollection, ...antiProcrastinationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const antiProcrastination: IAntiProcrastination = sampleWithRequiredData;
        const antiProcrastination2: IAntiProcrastination = sampleWithPartialData;
        expectedResult = service.addAntiProcrastinationToCollectionIfMissing([], antiProcrastination, antiProcrastination2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(antiProcrastination);
        expect(expectedResult).toContain(antiProcrastination2);
      });

      it('should accept null and undefined values', () => {
        const antiProcrastination: IAntiProcrastination = sampleWithRequiredData;
        expectedResult = service.addAntiProcrastinationToCollectionIfMissing([], null, antiProcrastination, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(antiProcrastination);
      });

      it('should return initial array if no AntiProcrastination is added', () => {
        const antiProcrastinationCollection: IAntiProcrastination[] = [sampleWithRequiredData];
        expectedResult = service.addAntiProcrastinationToCollectionIfMissing(antiProcrastinationCollection, undefined, null);
        expect(expectedResult).toEqual(antiProcrastinationCollection);
      });
    });

    describe('compareAntiProcrastination', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAntiProcrastination(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAntiProcrastination(entity1, entity2);
        const compareResult2 = service.compareAntiProcrastination(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAntiProcrastination(entity1, entity2);
        const compareResult2 = service.compareAntiProcrastination(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAntiProcrastination(entity1, entity2);
        const compareResult2 = service.compareAntiProcrastination(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
