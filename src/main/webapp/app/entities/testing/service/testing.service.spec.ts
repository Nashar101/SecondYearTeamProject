import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITesting } from '../testing.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../testing.test-samples';

import { TestingService } from './testing.service';

const requireRestSample: ITesting = {
  ...sampleWithRequiredData,
};

describe('Testing Service', () => {
  let service: TestingService;
  let httpMock: HttpTestingController;
  let expectedResult: ITesting | ITesting[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TestingService);
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

    it('should create a Testing', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const testing = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(testing).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Testing', () => {
      const testing = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(testing).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Testing', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Testing', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Testing', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTestingToCollectionIfMissing', () => {
      it('should add a Testing to an empty array', () => {
        const testing: ITesting = sampleWithRequiredData;
        expectedResult = service.addTestingToCollectionIfMissing([], testing);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(testing);
      });

      it('should not add a Testing to an array that contains it', () => {
        const testing: ITesting = sampleWithRequiredData;
        const testingCollection: ITesting[] = [
          {
            ...testing,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTestingToCollectionIfMissing(testingCollection, testing);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Testing to an array that doesn't contain it", () => {
        const testing: ITesting = sampleWithRequiredData;
        const testingCollection: ITesting[] = [sampleWithPartialData];
        expectedResult = service.addTestingToCollectionIfMissing(testingCollection, testing);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(testing);
      });

      it('should add only unique Testing to an array', () => {
        const testingArray: ITesting[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const testingCollection: ITesting[] = [sampleWithRequiredData];
        expectedResult = service.addTestingToCollectionIfMissing(testingCollection, ...testingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const testing: ITesting = sampleWithRequiredData;
        const testing2: ITesting = sampleWithPartialData;
        expectedResult = service.addTestingToCollectionIfMissing([], testing, testing2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(testing);
        expect(expectedResult).toContain(testing2);
      });

      it('should accept null and undefined values', () => {
        const testing: ITesting = sampleWithRequiredData;
        expectedResult = service.addTestingToCollectionIfMissing([], null, testing, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(testing);
      });

      it('should return initial array if no Testing is added', () => {
        const testingCollection: ITesting[] = [sampleWithRequiredData];
        expectedResult = service.addTestingToCollectionIfMissing(testingCollection, undefined, null);
        expect(expectedResult).toEqual(testingCollection);
      });
    });

    describe('compareTesting', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTesting(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTesting(entity1, entity2);
        const compareResult2 = service.compareTesting(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTesting(entity1, entity2);
        const compareResult2 = service.compareTesting(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTesting(entity1, entity2);
        const compareResult2 = service.compareTesting(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
