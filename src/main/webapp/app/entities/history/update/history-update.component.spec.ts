import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HistoryFormService } from './history-form.service';
import { HistoryService } from '../service/history.service';
import { IHistory } from '../history.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { HistoryUpdateComponent } from './history-update.component';

describe('History Management Update Component', () => {
  let comp: HistoryUpdateComponent;
  let fixture: ComponentFixture<HistoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let historyFormService: HistoryFormService;
  let historyService: HistoryService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HistoryUpdateComponent],
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
      .overrideTemplate(HistoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    historyFormService = TestBed.inject(HistoryFormService);
    historyService = TestBed.inject(HistoryService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const history: IHistory = { id: 456 };
      const user: IUser = { id: 41060 };
      history.user = user;

      const userCollection: IUser[] = [{ id: 51165 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ history });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const history: IHistory = { id: 456 };
      const user: IUser = { id: 97166 };
      history.user = user;

      activatedRoute.data = of({ history });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.history).toEqual(history);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistory>>();
      const history = { id: 123 };
      jest.spyOn(historyFormService, 'getHistory').mockReturnValue(history);
      jest.spyOn(historyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ history });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: history }));
      saveSubject.complete();

      // THEN
      expect(historyFormService.getHistory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(historyService.update).toHaveBeenCalledWith(expect.objectContaining(history));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistory>>();
      const history = { id: 123 };
      jest.spyOn(historyFormService, 'getHistory').mockReturnValue({ id: null });
      jest.spyOn(historyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ history: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: history }));
      saveSubject.complete();

      // THEN
      expect(historyFormService.getHistory).toHaveBeenCalled();
      expect(historyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistory>>();
      const history = { id: 123 };
      jest.spyOn(historyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ history });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(historyService.update).toHaveBeenCalled();
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
