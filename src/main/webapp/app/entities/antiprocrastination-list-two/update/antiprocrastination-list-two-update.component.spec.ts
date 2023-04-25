import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AntiprocrastinationListTwoFormService } from './antiprocrastination-list-two-form.service';
import { AntiprocrastinationListTwoService } from '../service/antiprocrastination-list-two.service';
import { IAntiprocrastinationListTwo } from '../antiprocrastination-list-two.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { AntiprocrastinationListTwoUpdateComponent } from './antiprocrastination-list-two-update.component';

describe('AntiprocrastinationListTwo Management Update Component', () => {
  let comp: AntiprocrastinationListTwoUpdateComponent;
  let fixture: ComponentFixture<AntiprocrastinationListTwoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let antiprocrastinationListTwoFormService: AntiprocrastinationListTwoFormService;
  let antiprocrastinationListTwoService: AntiprocrastinationListTwoService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AntiprocrastinationListTwoUpdateComponent],
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
      .overrideTemplate(AntiprocrastinationListTwoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AntiprocrastinationListTwoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    antiprocrastinationListTwoFormService = TestBed.inject(AntiprocrastinationListTwoFormService);
    antiprocrastinationListTwoService = TestBed.inject(AntiprocrastinationListTwoService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const antiprocrastinationListTwo: IAntiprocrastinationListTwo = { id: 456 };
      const user: IUser = { id: 41769 };
      antiprocrastinationListTwo.user = user;

      const userCollection: IUser[] = [{ id: 70802 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ antiprocrastinationListTwo });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const antiprocrastinationListTwo: IAntiprocrastinationListTwo = { id: 456 };
      const user: IUser = { id: 50711 };
      antiprocrastinationListTwo.user = user;

      activatedRoute.data = of({ antiprocrastinationListTwo });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.antiprocrastinationListTwo).toEqual(antiprocrastinationListTwo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntiprocrastinationListTwo>>();
      const antiprocrastinationListTwo = { id: 123 };
      jest.spyOn(antiprocrastinationListTwoFormService, 'getAntiprocrastinationListTwo').mockReturnValue(antiprocrastinationListTwo);
      jest.spyOn(antiprocrastinationListTwoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antiprocrastinationListTwo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: antiprocrastinationListTwo }));
      saveSubject.complete();

      // THEN
      expect(antiprocrastinationListTwoFormService.getAntiprocrastinationListTwo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(antiprocrastinationListTwoService.update).toHaveBeenCalledWith(expect.objectContaining(antiprocrastinationListTwo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntiprocrastinationListTwo>>();
      const antiprocrastinationListTwo = { id: 123 };
      jest.spyOn(antiprocrastinationListTwoFormService, 'getAntiprocrastinationListTwo').mockReturnValue({ id: null });
      jest.spyOn(antiprocrastinationListTwoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antiprocrastinationListTwo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: antiprocrastinationListTwo }));
      saveSubject.complete();

      // THEN
      expect(antiprocrastinationListTwoFormService.getAntiprocrastinationListTwo).toHaveBeenCalled();
      expect(antiprocrastinationListTwoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAntiprocrastinationListTwo>>();
      const antiprocrastinationListTwo = { id: 123 };
      jest.spyOn(antiprocrastinationListTwoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ antiprocrastinationListTwo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(antiprocrastinationListTwoService.update).toHaveBeenCalled();
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
