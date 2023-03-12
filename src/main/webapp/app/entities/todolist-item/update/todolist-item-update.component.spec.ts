import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TodolistItemFormService } from './todolist-item-form.service';
import { TodolistItemService } from '../service/todolist-item.service';
import { ITodolistItem } from '../todolist-item.model';

import { TodolistItemUpdateComponent } from './todolist-item-update.component';

describe('TodolistItem Management Update Component', () => {
  let comp: TodolistItemUpdateComponent;
  let fixture: ComponentFixture<TodolistItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let todolistItemFormService: TodolistItemFormService;
  let todolistItemService: TodolistItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TodolistItemUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TodolistItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TodolistItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    todolistItemFormService = TestBed.inject(TodolistItemFormService);
    todolistItemService = TestBed.inject(TodolistItemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const todolistItem: ITodolistItem = { id: 456 };

      activatedRoute.data = of({ todolistItem });
      comp.ngOnInit();

      expect(comp.todolistItem).toEqual(todolistItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITodolistItem>>();
      const todolistItem = { id: 123 };
      jest.spyOn(todolistItemFormService, 'getTodolistItem').mockReturnValue(todolistItem);
      jest.spyOn(todolistItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todolistItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todolistItem }));
      saveSubject.complete();

      // THEN
      expect(todolistItemFormService.getTodolistItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(todolistItemService.update).toHaveBeenCalledWith(expect.objectContaining(todolistItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITodolistItem>>();
      const todolistItem = { id: 123 };
      jest.spyOn(todolistItemFormService, 'getTodolistItem').mockReturnValue({ id: null });
      jest.spyOn(todolistItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todolistItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: todolistItem }));
      saveSubject.complete();

      // THEN
      expect(todolistItemFormService.getTodolistItem).toHaveBeenCalled();
      expect(todolistItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITodolistItem>>();
      const todolistItem = { id: 123 };
      jest.spyOn(todolistItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ todolistItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(todolistItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
