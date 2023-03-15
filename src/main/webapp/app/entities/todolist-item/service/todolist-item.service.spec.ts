import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITodolistItem } from '../todolist-item.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../todolist-item.test-samples';

import { TodolistItemService, RestTodolistItem } from './todolist-item.service';

const requireRestSample: RestTodolistItem = {
  ...sampleWithRequiredData,
  creationTime: sampleWithRequiredData.creationTime?.toJSON(),
  lastEditTime: sampleWithRequiredData.lastEditTime?.toJSON(),
};

describe('TodolistItem Service', () => {
  let service: TodolistItemService;
  let httpMock: HttpTestingController;
  let expectedResult: ITodolistItem | ITodolistItem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TodolistItemService);
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

    it('should create a TodolistItem', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const todolistItem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(todolistItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TodolistItem', () => {
      const todolistItem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(todolistItem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TodolistItem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TodolistItem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TodolistItem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTodolistItemToCollectionIfMissing', () => {
      it('should add a TodolistItem to an empty array', () => {
        const todolistItem: ITodolistItem = sampleWithRequiredData;
        expectedResult = service.addTodolistItemToCollectionIfMissing([], todolistItem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(todolistItem);
      });

      it('should not add a TodolistItem to an array that contains it', () => {
        const todolistItem: ITodolistItem = sampleWithRequiredData;
        const todolistItemCollection: ITodolistItem[] = [
          {
            ...todolistItem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTodolistItemToCollectionIfMissing(todolistItemCollection, todolistItem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TodolistItem to an array that doesn't contain it", () => {
        const todolistItem: ITodolistItem = sampleWithRequiredData;
        const todolistItemCollection: ITodolistItem[] = [sampleWithPartialData];
        expectedResult = service.addTodolistItemToCollectionIfMissing(todolistItemCollection, todolistItem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(todolistItem);
      });

      it('should add only unique TodolistItem to an array', () => {
        const todolistItemArray: ITodolistItem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const todolistItemCollection: ITodolistItem[] = [sampleWithRequiredData];
        expectedResult = service.addTodolistItemToCollectionIfMissing(todolistItemCollection, ...todolistItemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const todolistItem: ITodolistItem = sampleWithRequiredData;
        const todolistItem2: ITodolistItem = sampleWithPartialData;
        expectedResult = service.addTodolistItemToCollectionIfMissing([], todolistItem, todolistItem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(todolistItem);
        expect(expectedResult).toContain(todolistItem2);
      });

      it('should accept null and undefined values', () => {
        const todolistItem: ITodolistItem = sampleWithRequiredData;
        expectedResult = service.addTodolistItemToCollectionIfMissing([], null, todolistItem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(todolistItem);
      });

      it('should return initial array if no TodolistItem is added', () => {
        const todolistItemCollection: ITodolistItem[] = [sampleWithRequiredData];
        expectedResult = service.addTodolistItemToCollectionIfMissing(todolistItemCollection, undefined, null);
        expect(expectedResult).toEqual(todolistItemCollection);
      });
    });

    describe('compareTodolistItem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTodolistItem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTodolistItem(entity1, entity2);
        const compareResult2 = service.compareTodolistItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTodolistItem(entity1, entity2);
        const compareResult2 = service.compareTodolistItem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTodolistItem(entity1, entity2);
        const compareResult2 = service.compareTodolistItem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
