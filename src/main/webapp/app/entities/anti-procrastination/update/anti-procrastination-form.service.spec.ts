import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../anti-procrastination.test-samples';

import { AntiProcrastinationFormService } from './anti-procrastination-form.service';

describe('AntiProcrastination Form Service', () => {
  let service: AntiProcrastinationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntiProcrastinationFormService);
  });

  describe('Service methods', () => {
    describe('createAntiProcrastinationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAntiProcrastinationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            url: expect.any(Object),
            type: expect.any(Object),
            days: expect.any(Object),
            hours: expect.any(Object),
            minutes: expect.any(Object),
            seconds: expect.any(Object),
          })
        );
      });

      it('passing IAntiProcrastination should create a new form with FormGroup', () => {
        const formGroup = service.createAntiProcrastinationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            url: expect.any(Object),
            type: expect.any(Object),
            days: expect.any(Object),
            hours: expect.any(Object),
            minutes: expect.any(Object),
            seconds: expect.any(Object),
          })
        );
      });
    });

    describe('getAntiProcrastination', () => {
      it('should return NewAntiProcrastination for default AntiProcrastination initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAntiProcrastinationFormGroup(sampleWithNewData);

        const antiProcrastination = service.getAntiProcrastination(formGroup) as any;

        expect(antiProcrastination).toMatchObject(sampleWithNewData);
      });

      it('should return NewAntiProcrastination for empty AntiProcrastination initial value', () => {
        const formGroup = service.createAntiProcrastinationFormGroup();

        const antiProcrastination = service.getAntiProcrastination(formGroup) as any;

        expect(antiProcrastination).toMatchObject({});
      });

      it('should return IAntiProcrastination', () => {
        const formGroup = service.createAntiProcrastinationFormGroup(sampleWithRequiredData);

        const antiProcrastination = service.getAntiProcrastination(formGroup) as any;

        expect(antiProcrastination).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAntiProcrastination should not enable id FormControl', () => {
        const formGroup = service.createAntiProcrastinationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAntiProcrastination should disable id FormControl', () => {
        const formGroup = service.createAntiProcrastinationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
