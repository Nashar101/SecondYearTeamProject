import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../anti-procrastination-list.test-samples';

import { AntiProcrastinationListFormService } from './anti-procrastination-list-form.service';

describe('AntiProcrastinationList Form Service', () => {
  let service: AntiProcrastinationListFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntiProcrastinationListFormService);
  });

  describe('Service methods', () => {
    describe('createAntiProcrastinationListFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAntiProcrastinationListFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            link: expect.any(Object),
            type: expect.any(Object),
            days: expect.any(Object),
            hours: expect.any(Object),
            minutes: expect.any(Object),
            seconds: expect.any(Object),
            empty: expect.any(Object),
            idk: expect.any(Object),
            idk1: expect.any(Object),
            dueDate: expect.any(Object),
          })
        );
      });

      it('passing IAntiProcrastinationList should create a new form with FormGroup', () => {
        const formGroup = service.createAntiProcrastinationListFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            link: expect.any(Object),
            type: expect.any(Object),
            days: expect.any(Object),
            hours: expect.any(Object),
            minutes: expect.any(Object),
            seconds: expect.any(Object),
            empty: expect.any(Object),
            idk: expect.any(Object),
            idk1: expect.any(Object),
            dueDate: expect.any(Object),
          })
        );
      });
    });

    describe('getAntiProcrastinationList', () => {
      it('should return NewAntiProcrastinationList for default AntiProcrastinationList initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAntiProcrastinationListFormGroup(sampleWithNewData);

        const antiProcrastinationList = service.getAntiProcrastinationList(formGroup) as any;

        expect(antiProcrastinationList).toMatchObject(sampleWithNewData);
      });

      it('should return NewAntiProcrastinationList for empty AntiProcrastinationList initial value', () => {
        const formGroup = service.createAntiProcrastinationListFormGroup();

        const antiProcrastinationList = service.getAntiProcrastinationList(formGroup) as any;

        expect(antiProcrastinationList).toMatchObject({});
      });

      it('should return IAntiProcrastinationList', () => {
        const formGroup = service.createAntiProcrastinationListFormGroup(sampleWithRequiredData);

        const antiProcrastinationList = service.getAntiProcrastinationList(formGroup) as any;

        expect(antiProcrastinationList).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAntiProcrastinationList should not enable id FormControl', () => {
        const formGroup = service.createAntiProcrastinationListFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAntiProcrastinationList should disable id FormControl', () => {
        const formGroup = service.createAntiProcrastinationListFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
