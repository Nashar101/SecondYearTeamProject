import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AlarmFormService } from './alarm-form.service';
import { AlarmService } from '../service/alarm.service';
import { IAlarm } from '../alarm.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { AlarmUpdateComponent } from './alarm-update.component';

describe('Alarm Management Update Component', () => {
  let comp: AlarmUpdateComponent;
  let fixture: ComponentFixture<AlarmUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let alarmFormService: AlarmFormService;
  let alarmService: AlarmService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AlarmUpdateComponent],
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
      .overrideTemplate(AlarmUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlarmUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    alarmFormService = TestBed.inject(AlarmFormService);
    alarmService = TestBed.inject(AlarmService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const alarm: IAlarm = { id: 456 };
      const user: IUser = { id: 66604 };
      alarm.user = user;

      const userCollection: IUser[] = [{ id: 41908 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ alarm });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const alarm: IAlarm = { id: 456 };
      const user: IUser = { id: 83423 };
      alarm.user = user;

      activatedRoute.data = of({ alarm });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.alarm).toEqual(alarm);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlarm>>();
      const alarm = { id: 123 };
      jest.spyOn(alarmFormService, 'getAlarm').mockReturnValue(alarm);
      jest.spyOn(alarmService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alarm });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: alarm }));
      saveSubject.complete();

      // THEN
      expect(alarmFormService.getAlarm).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(alarmService.update).toHaveBeenCalledWith(expect.objectContaining(alarm));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlarm>>();
      const alarm = { id: 123 };
      jest.spyOn(alarmFormService, 'getAlarm').mockReturnValue({ id: null });
      jest.spyOn(alarmService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alarm: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: alarm }));
      saveSubject.complete();

      // THEN
      expect(alarmFormService.getAlarm).toHaveBeenCalled();
      expect(alarmService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAlarm>>();
      const alarm = { id: 123 };
      jest.spyOn(alarmService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ alarm });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(alarmService.update).toHaveBeenCalled();
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
