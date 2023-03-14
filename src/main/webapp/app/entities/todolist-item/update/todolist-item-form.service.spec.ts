import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../todolist-item.test-samples';

import { TodolistItemFormService } from './todolist-item-form.service';

describe('TodolistItem Form Service', () => {
  let service: TodolistItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodolistItemFormService);
  });

  describe('Service methods', () => {
    describe('createTodolistItemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTodolistItemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            heading: expect.any(Object),
            description: expect.any(Object),
            creationTime: expect.any(Object),
            lastEditTime: expect.any(Object),
            completed: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing ITodolistItem should create a new form with FormGroup', () => {
        const formGroup = service.createTodolistItemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            heading: expect.any(Object),
            description: expect.any(Object),
            creationTime: expect.any(Object),
            lastEditTime: expect.any(Object),
            completed: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getTodolistItem', () => {
      it('should return NewTodolistItem for default TodolistItem initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTodolistItemFormGroup(sampleWithNewData);

        const todolistItem = service.getTodolistItem(formGroup) as any;

        expect(todolistItem).toMatchObject(sampleWithNewData);
      });

      it('should return NewTodolistItem for empty TodolistItem initial value', () => {
        const formGroup = service.createTodolistItemFormGroup();

        const todolistItem = service.getTodolistItem(formGroup) as any;

        expect(todolistItem).toMatchObject({});
      });

      it('should return ITodolistItem', () => {
        const formGroup = service.createTodolistItemFormGroup(sampleWithRequiredData);

        const todolistItem = service.getTodolistItem(formGroup) as any;

        expect(todolistItem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITodolistItem should not enable id FormControl', () => {
        const formGroup = service.createTodolistItemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTodolistItem should disable id FormControl', () => {
        const formGroup = service.createTodolistItemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
