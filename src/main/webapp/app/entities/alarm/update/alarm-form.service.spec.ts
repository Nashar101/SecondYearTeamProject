import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../alarm.test-samples';

import { AlarmFormService } from './alarm-form.service';

describe('Alarm Form Service', () => {
  let service: AlarmFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlarmFormService);
  });

  describe('Service methods', () => {
    describe('createAlarmFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAlarmFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            alarmName: expect.any(Object),
            type: expect.any(Object),
            hours: expect.any(Object),
            minutes: expect.any(Object),
            seconds: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IAlarm should create a new form with FormGroup', () => {
        const formGroup = service.createAlarmFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            alarmName: expect.any(Object),
            type: expect.any(Object),
            hours: expect.any(Object),
            minutes: expect.any(Object),
            seconds: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getAlarm', () => {
      it('should return NewAlarm for default Alarm initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAlarmFormGroup(sampleWithNewData);

        const alarm = service.getAlarm(formGroup) as any;

        expect(alarm).toMatchObject(sampleWithNewData);
      });

      it('should return NewAlarm for empty Alarm initial value', () => {
        const formGroup = service.createAlarmFormGroup();

        const alarm = service.getAlarm(formGroup) as any;

        expect(alarm).toMatchObject({});
      });

      it('should return IAlarm', () => {
        const formGroup = service.createAlarmFormGroup(sampleWithRequiredData);

        const alarm = service.getAlarm(formGroup) as any;

        expect(alarm).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAlarm should not enable id FormControl', () => {
        const formGroup = service.createAlarmFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAlarm should disable id FormControl', () => {
        const formGroup = service.createAlarmFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
