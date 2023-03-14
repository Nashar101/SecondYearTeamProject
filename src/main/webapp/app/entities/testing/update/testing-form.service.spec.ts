import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../testing.test-samples';

import { TestingFormService } from './testing-form.service';

describe('Testing Form Service', () => {
  let service: TestingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestingFormService);
  });

  describe('Service methods', () => {
    describe('createTestingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTestingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            suwi: expect.any(Object),
          })
        );
      });

      it('passing ITesting should create a new form with FormGroup', () => {
        const formGroup = service.createTestingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            suwi: expect.any(Object),
          })
        );
      });
    });

    describe('getTesting', () => {
      it('should return NewTesting for default Testing initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTestingFormGroup(sampleWithNewData);

        const testing = service.getTesting(formGroup) as any;

        expect(testing).toMatchObject(sampleWithNewData);
      });

      it('should return NewTesting for empty Testing initial value', () => {
        const formGroup = service.createTestingFormGroup();

        const testing = service.getTesting(formGroup) as any;

        expect(testing).toMatchObject({});
      });

      it('should return ITesting', () => {
        const formGroup = service.createTestingFormGroup(sampleWithRequiredData);

        const testing = service.getTesting(formGroup) as any;

        expect(testing).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITesting should not enable id FormControl', () => {
        const formGroup = service.createTestingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTesting should disable id FormControl', () => {
        const formGroup = service.createTestingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
