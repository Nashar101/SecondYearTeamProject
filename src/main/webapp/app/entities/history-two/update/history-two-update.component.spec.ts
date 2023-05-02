import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HistoryTwoFormService } from './history-two-form.service';
import { HistoryTwoService } from '../service/history-two.service';
import { IHistoryTwo } from '../history-two.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { HistoryTwoUpdateComponent } from './history-two-update.component';

describe('HistoryTwo Management Update Component', () => {
  let comp: HistoryTwoUpdateComponent;
  let fixture: ComponentFixture<HistoryTwoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let historyTwoFormService: HistoryTwoFormService;
  let historyTwoService: HistoryTwoService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HistoryTwoUpdateComponent],
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
      .overrideTemplate(HistoryTwoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistoryTwoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    historyTwoFormService = TestBed.inject(HistoryTwoFormService);
    historyTwoService = TestBed.inject(HistoryTwoService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const historyTwo: IHistoryTwo = { id: 456 };
      const user: IUser = { id: 89994 };
      historyTwo.user = user;

      const userCollection: IUser[] = [{ id: 15736 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ historyTwo });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const historyTwo: IHistoryTwo = { id: 456 };
      const user: IUser = { id: 12182 };
      historyTwo.user = user;

      activatedRoute.data = of({ historyTwo });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.historyTwo).toEqual(historyTwo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistoryTwo>>();
      const historyTwo = { id: 123 };
      jest.spyOn(historyTwoFormService, 'getHistoryTwo').mockReturnValue(historyTwo);
      jest.spyOn(historyTwoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historyTwo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: historyTwo }));
      saveSubject.complete();

      // THEN
      expect(historyTwoFormService.getHistoryTwo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(historyTwoService.update).toHaveBeenCalledWith(expect.objectContaining(historyTwo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistoryTwo>>();
      const historyTwo = { id: 123 };
      jest.spyOn(historyTwoFormService, 'getHistoryTwo').mockReturnValue({ id: null });
      jest.spyOn(historyTwoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historyTwo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: historyTwo }));
      saveSubject.complete();

      // THEN
      expect(historyTwoFormService.getHistoryTwo).toHaveBeenCalled();
      expect(historyTwoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHistoryTwo>>();
      const historyTwo = { id: 123 };
      jest.spyOn(historyTwoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ historyTwo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(historyTwoService.update).toHaveBeenCalled();
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
