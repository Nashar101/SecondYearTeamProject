import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHistoryTwo } from '../history-two.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../history-two.test-samples';

import { HistoryTwoService } from './history-two.service';

const requireRestSample: IHistoryTwo = {
  ...sampleWithRequiredData,
};

describe('HistoryTwo Service', () => {
  let service: HistoryTwoService;
  let httpMock: HttpTestingController;
  let expectedResult: IHistoryTwo | IHistoryTwo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HistoryTwoService);
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

    it('should create a HistoryTwo', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const historyTwo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(historyTwo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HistoryTwo', () => {
      const historyTwo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(historyTwo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HistoryTwo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HistoryTwo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HistoryTwo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHistoryTwoToCollectionIfMissing', () => {
      it('should add a HistoryTwo to an empty array', () => {
        const historyTwo: IHistoryTwo = sampleWithRequiredData;
        expectedResult = service.addHistoryTwoToCollectionIfMissing([], historyTwo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(historyTwo);
      });

      it('should not add a HistoryTwo to an array that contains it', () => {
        const historyTwo: IHistoryTwo = sampleWithRequiredData;
        const historyTwoCollection: IHistoryTwo[] = [
          {
            ...historyTwo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHistoryTwoToCollectionIfMissing(historyTwoCollection, historyTwo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HistoryTwo to an array that doesn't contain it", () => {
        const historyTwo: IHistoryTwo = sampleWithRequiredData;
        const historyTwoCollection: IHistoryTwo[] = [sampleWithPartialData];
        expectedResult = service.addHistoryTwoToCollectionIfMissing(historyTwoCollection, historyTwo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(historyTwo);
      });

      it('should add only unique HistoryTwo to an array', () => {
        const historyTwoArray: IHistoryTwo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const historyTwoCollection: IHistoryTwo[] = [sampleWithRequiredData];
        expectedResult = service.addHistoryTwoToCollectionIfMissing(historyTwoCollection, ...historyTwoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const historyTwo: IHistoryTwo = sampleWithRequiredData;
        const historyTwo2: IHistoryTwo = sampleWithPartialData;
        expectedResult = service.addHistoryTwoToCollectionIfMissing([], historyTwo, historyTwo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(historyTwo);
        expect(expectedResult).toContain(historyTwo2);
      });

      it('should accept null and undefined values', () => {
        const historyTwo: IHistoryTwo = sampleWithRequiredData;
        expectedResult = service.addHistoryTwoToCollectionIfMissing([], null, historyTwo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(historyTwo);
      });

      it('should return initial array if no HistoryTwo is added', () => {
        const historyTwoCollection: IHistoryTwo[] = [sampleWithRequiredData];
        expectedResult = service.addHistoryTwoToCollectionIfMissing(historyTwoCollection, undefined, null);
        expect(expectedResult).toEqual(historyTwoCollection);
      });
    });

    describe('compareHistoryTwo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHistoryTwo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHistoryTwo(entity1, entity2);
        const compareResult2 = service.compareHistoryTwo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHistoryTwo(entity1, entity2);
        const compareResult2 = service.compareHistoryTwo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHistoryTwo(entity1, entity2);
        const compareResult2 = service.compareHistoryTwo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
