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

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { TodolistItemUpdateComponent } from './todolist-item-update.component';

describe('TodolistItem Management Update Component', () => {
  let comp: TodolistItemUpdateComponent;
  let fixture: ComponentFixture<TodolistItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let todolistItemFormService: TodolistItemFormService;
  let todolistItemService: TodolistItemService;
  let userService: UserService;

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
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const todolistItem: ITodolistItem = { id: 456 };
      const user: IUser = { id: 30735 };
      todolistItem.user = user;

      const userCollection: IUser[] = [{ id: 68320 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ todolistItem });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const todolistItem: ITodolistItem = { id: 456 };
      const user: IUser = { id: 58602 };
      todolistItem.user = user;

      activatedRoute.data = of({ todolistItem });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
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

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
