import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../antiprocrastination-list-two.test-samples';

import { AntiprocrastinationListTwoFormService } from './antiprocrastination-list-two-form.service';

describe('AntiprocrastinationListTwo Form Service', () => {
  let service: AntiprocrastinationListTwoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AntiprocrastinationListTwoFormService);
  });

  describe('Service methods', () => {
    describe('createAntiprocrastinationListTwoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAntiprocrastinationListTwoFormGroup();

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
            user: expect.any(Object),
          })
        );
      });

      it('passing IAntiprocrastinationListTwo should create a new form with FormGroup', () => {
        const formGroup = service.createAntiprocrastinationListTwoFormGroup(sampleWithRequiredData);

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
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getAntiprocrastinationListTwo', () => {
      it('should return NewAntiprocrastinationListTwo for default AntiprocrastinationListTwo initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAntiprocrastinationListTwoFormGroup(sampleWithNewData);

        const antiprocrastinationListTwo = service.getAntiprocrastinationListTwo(formGroup) as any;

        expect(antiprocrastinationListTwo).toMatchObject(sampleWithNewData);
      });

      it('should return NewAntiprocrastinationListTwo for empty AntiprocrastinationListTwo initial value', () => {
        const formGroup = service.createAntiprocrastinationListTwoFormGroup();

        const antiprocrastinationListTwo = service.getAntiprocrastinationListTwo(formGroup) as any;

        expect(antiprocrastinationListTwo).toMatchObject({});
      });

      it('should return IAntiprocrastinationListTwo', () => {
        const formGroup = service.createAntiprocrastinationListTwoFormGroup(sampleWithRequiredData);

        const antiprocrastinationListTwo = service.getAntiprocrastinationListTwo(formGroup) as any;

        expect(antiprocrastinationListTwo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAntiprocrastinationListTwo should not enable id FormControl', () => {
        const formGroup = service.createAntiprocrastinationListTwoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAntiprocrastinationListTwo should disable id FormControl', () => {
        const formGroup = service.createAntiprocrastinationListTwoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
