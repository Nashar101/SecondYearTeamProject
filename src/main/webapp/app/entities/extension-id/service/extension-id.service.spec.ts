import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExtensionID } from '../extension-id.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../extension-id.test-samples';

import { ExtensionIDService } from './extension-id.service';

const requireRestSample: IExtensionID = {
  ...sampleWithRequiredData,
};

describe('ExtensionID Service', () => {
  let service: ExtensionIDService;
  let httpMock: HttpTestingController;
  let expectedResult: IExtensionID | IExtensionID[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExtensionIDService);
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

    it('should create a ExtensionID', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const extensionID = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(extensionID).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExtensionID', () => {
      const extensionID = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(extensionID).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExtensionID', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExtensionID', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExtensionID', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExtensionIDToCollectionIfMissing', () => {
      it('should add a ExtensionID to an empty array', () => {
        const extensionID: IExtensionID = sampleWithRequiredData;
        expectedResult = service.addExtensionIDToCollectionIfMissing([], extensionID);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(extensionID);
      });

      it('should not add a ExtensionID to an array that contains it', () => {
        const extensionID: IExtensionID = sampleWithRequiredData;
        const extensionIDCollection: IExtensionID[] = [
          {
            ...extensionID,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExtensionIDToCollectionIfMissing(extensionIDCollection, extensionID);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExtensionID to an array that doesn't contain it", () => {
        const extensionID: IExtensionID = sampleWithRequiredData;
        const extensionIDCollection: IExtensionID[] = [sampleWithPartialData];
        expectedResult = service.addExtensionIDToCollectionIfMissing(extensionIDCollection, extensionID);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(extensionID);
      });

      it('should add only unique ExtensionID to an array', () => {
        const extensionIDArray: IExtensionID[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const extensionIDCollection: IExtensionID[] = [sampleWithRequiredData];
        expectedResult = service.addExtensionIDToCollectionIfMissing(extensionIDCollection, ...extensionIDArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const extensionID: IExtensionID = sampleWithRequiredData;
        const extensionID2: IExtensionID = sampleWithPartialData;
        expectedResult = service.addExtensionIDToCollectionIfMissing([], extensionID, extensionID2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(extensionID);
        expect(expectedResult).toContain(extensionID2);
      });

      it('should accept null and undefined values', () => {
        const extensionID: IExtensionID = sampleWithRequiredData;
        expectedResult = service.addExtensionIDToCollectionIfMissing([], null, extensionID, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(extensionID);
      });

      it('should return initial array if no ExtensionID is added', () => {
        const extensionIDCollection: IExtensionID[] = [sampleWithRequiredData];
        expectedResult = service.addExtensionIDToCollectionIfMissing(extensionIDCollection, undefined, null);
        expect(expectedResult).toEqual(extensionIDCollection);
      });
    });

    describe('compareExtensionID', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExtensionID(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExtensionID(entity1, entity2);
        const compareResult2 = service.compareExtensionID(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExtensionID(entity1, entity2);
        const compareResult2 = service.compareExtensionID(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExtensionID(entity1, entity2);
        const compareResult2 = service.compareExtensionID(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
