import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ScheduleEventFormService } from './schedule-event-form.service';
import { ScheduleEventService } from '../service/schedule-event.service';
import { IScheduleEvent } from '../schedule-event.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ScheduleEventUpdateComponent } from './schedule-event-update.component';

describe('ScheduleEvent Management Update Component', () => {
  let comp: ScheduleEventUpdateComponent;
  let fixture: ComponentFixture<ScheduleEventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let scheduleEventFormService: ScheduleEventFormService;
  let scheduleEventService: ScheduleEventService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ScheduleEventUpdateComponent],
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
      .overrideTemplate(ScheduleEventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ScheduleEventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    scheduleEventFormService = TestBed.inject(ScheduleEventFormService);
    scheduleEventService = TestBed.inject(ScheduleEventService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const scheduleEvent: IScheduleEvent = { id: 456 };
      const user: IUser = { id: 9416 };
      scheduleEvent.user = user;

      const userCollection: IUser[] = [{ id: 73874 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ scheduleEvent });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const scheduleEvent: IScheduleEvent = { id: 456 };
      const user: IUser = { id: 7132 };
      scheduleEvent.user = user;

      activatedRoute.data = of({ scheduleEvent });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.scheduleEvent).toEqual(scheduleEvent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScheduleEvent>>();
      const scheduleEvent = { id: 123 };
      jest.spyOn(scheduleEventFormService, 'getScheduleEvent').mockReturnValue(scheduleEvent);
      jest.spyOn(scheduleEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scheduleEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scheduleEvent }));
      saveSubject.complete();

      // THEN
      expect(scheduleEventFormService.getScheduleEvent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(scheduleEventService.update).toHaveBeenCalledWith(expect.objectContaining(scheduleEvent));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScheduleEvent>>();
      const scheduleEvent = { id: 123 };
      jest.spyOn(scheduleEventFormService, 'getScheduleEvent').mockReturnValue({ id: null });
      jest.spyOn(scheduleEventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scheduleEvent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: scheduleEvent }));
      saveSubject.complete();

      // THEN
      expect(scheduleEventFormService.getScheduleEvent).toHaveBeenCalled();
      expect(scheduleEventService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IScheduleEvent>>();
      const scheduleEvent = { id: 123 };
      jest.spyOn(scheduleEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ scheduleEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(scheduleEventService.update).toHaveBeenCalled();
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
