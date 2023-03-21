import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../schedule-event.test-samples';

import { ScheduleEventFormService } from './schedule-event-form.service';

describe('ScheduleEvent Form Service', () => {
  let service: ScheduleEventFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleEventFormService);
  });

  describe('Service methods', () => {
    describe('createScheduleEventFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createScheduleEventFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            heading: expect.any(Object),
            date: expect.any(Object),
            details: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IScheduleEvent should create a new form with FormGroup', () => {
        const formGroup = service.createScheduleEventFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTime: expect.any(Object),
            endTime: expect.any(Object),
            heading: expect.any(Object),
            date: expect.any(Object),
            details: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getScheduleEvent', () => {
      it('should return NewScheduleEvent for default ScheduleEvent initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createScheduleEventFormGroup(sampleWithNewData);

        const scheduleEvent = service.getScheduleEvent(formGroup) as any;

        expect(scheduleEvent).toMatchObject(sampleWithNewData);
      });

      it('should return NewScheduleEvent for empty ScheduleEvent initial value', () => {
        const formGroup = service.createScheduleEventFormGroup();

        const scheduleEvent = service.getScheduleEvent(formGroup) as any;

        expect(scheduleEvent).toMatchObject({});
      });

      it('should return IScheduleEvent', () => {
        const formGroup = service.createScheduleEventFormGroup(sampleWithRequiredData);

        const scheduleEvent = service.getScheduleEvent(formGroup) as any;

        expect(scheduleEvent).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IScheduleEvent should not enable id FormControl', () => {
        const formGroup = service.createScheduleEventFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewScheduleEvent should disable id FormControl', () => {
        const formGroup = service.createScheduleEventFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
