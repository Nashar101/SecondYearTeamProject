import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDiaryPage } from '../diary-page.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../diary-page.test-samples';

import { DiaryPageService, RestDiaryPage } from './diary-page.service';

const requireRestSample: RestDiaryPage = {
  ...sampleWithRequiredData,
  pageDate: sampleWithRequiredData.pageDate?.toJSON(),
  creationTime: sampleWithRequiredData.creationTime?.toJSON(),
  lastEditTime: sampleWithRequiredData.lastEditTime?.toJSON(),
};

describe('DiaryPage Service', () => {
  let service: DiaryPageService;
  let httpMock: HttpTestingController;
  let expectedResult: IDiaryPage | IDiaryPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DiaryPageService);
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

    it('should create a DiaryPage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const diaryPage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(diaryPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DiaryPage', () => {
      const diaryPage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(diaryPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DiaryPage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DiaryPage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DiaryPage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDiaryPageToCollectionIfMissing', () => {
      it('should add a DiaryPage to an empty array', () => {
        const diaryPage: IDiaryPage = sampleWithRequiredData;
        expectedResult = service.addDiaryPageToCollectionIfMissing([], diaryPage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(diaryPage);
      });

      it('should not add a DiaryPage to an array that contains it', () => {
        const diaryPage: IDiaryPage = sampleWithRequiredData;
        const diaryPageCollection: IDiaryPage[] = [
          {
            ...diaryPage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDiaryPageToCollectionIfMissing(diaryPageCollection, diaryPage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DiaryPage to an array that doesn't contain it", () => {
        const diaryPage: IDiaryPage = sampleWithRequiredData;
        const diaryPageCollection: IDiaryPage[] = [sampleWithPartialData];
        expectedResult = service.addDiaryPageToCollectionIfMissing(diaryPageCollection, diaryPage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(diaryPage);
      });

      it('should add only unique DiaryPage to an array', () => {
        const diaryPageArray: IDiaryPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const diaryPageCollection: IDiaryPage[] = [sampleWithRequiredData];
        expectedResult = service.addDiaryPageToCollectionIfMissing(diaryPageCollection, ...diaryPageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const diaryPage: IDiaryPage = sampleWithRequiredData;
        const diaryPage2: IDiaryPage = sampleWithPartialData;
        expectedResult = service.addDiaryPageToCollectionIfMissing([], diaryPage, diaryPage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(diaryPage);
        expect(expectedResult).toContain(diaryPage2);
      });

      it('should accept null and undefined values', () => {
        const diaryPage: IDiaryPage = sampleWithRequiredData;
        expectedResult = service.addDiaryPageToCollectionIfMissing([], null, diaryPage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(diaryPage);
      });

      it('should return initial array if no DiaryPage is added', () => {
        const diaryPageCollection: IDiaryPage[] = [sampleWithRequiredData];
        expectedResult = service.addDiaryPageToCollectionIfMissing(diaryPageCollection, undefined, null);
        expect(expectedResult).toEqual(diaryPageCollection);
      });
    });

    describe('compareDiaryPage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDiaryPage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDiaryPage(entity1, entity2);
        const compareResult2 = service.compareDiaryPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDiaryPage(entity1, entity2);
        const compareResult2 = service.compareDiaryPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDiaryPage(entity1, entity2);
        const compareResult2 = service.compareDiaryPage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
