import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DiaryPageFormService } from './diary-page-form.service';
import { DiaryPageService } from '../service/diary-page.service';
import { IDiaryPage } from '../diary-page.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { DiaryPageUpdateComponent } from './diary-page-update.component';

describe('DiaryPage Management Update Component', () => {
  let comp: DiaryPageUpdateComponent;
  let fixture: ComponentFixture<DiaryPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let diaryPageFormService: DiaryPageFormService;
  let diaryPageService: DiaryPageService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DiaryPageUpdateComponent],
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
      .overrideTemplate(DiaryPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiaryPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    diaryPageFormService = TestBed.inject(DiaryPageFormService);
    diaryPageService = TestBed.inject(DiaryPageService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const diaryPage: IDiaryPage = { id: 456 };
      const user: IUser = { id: 71287 };
      diaryPage.user = user;

      const userCollection: IUser[] = [{ id: 91948 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ diaryPage });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const diaryPage: IDiaryPage = { id: 456 };
      const user: IUser = { id: 54772 };
      diaryPage.user = user;

      activatedRoute.data = of({ diaryPage });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.diaryPage).toEqual(diaryPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiaryPage>>();
      const diaryPage = { id: 123 };
      jest.spyOn(diaryPageFormService, 'getDiaryPage').mockReturnValue(diaryPage);
      jest.spyOn(diaryPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diaryPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: diaryPage }));
      saveSubject.complete();

      // THEN
      expect(diaryPageFormService.getDiaryPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(diaryPageService.update).toHaveBeenCalledWith(expect.objectContaining(diaryPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiaryPage>>();
      const diaryPage = { id: 123 };
      jest.spyOn(diaryPageFormService, 'getDiaryPage').mockReturnValue({ id: null });
      jest.spyOn(diaryPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diaryPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: diaryPage }));
      saveSubject.complete();

      // THEN
      expect(diaryPageFormService.getDiaryPage).toHaveBeenCalled();
      expect(diaryPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiaryPage>>();
      const diaryPage = { id: 123 };
      jest.spyOn(diaryPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diaryPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(diaryPageService.update).toHaveBeenCalled();
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
