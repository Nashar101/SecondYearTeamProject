import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../email.test-samples';

import { EmailFormService } from './email-form.service';

describe('Email Form Service', () => {
  let service: EmailFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailFormService);
  });

  describe('Service methods', () => {
    describe('createEmailFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmailFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subject: expect.any(Object),
            content: expect.any(Object),
            receivedDate: expect.any(Object),
            deadline: expect.any(Object),
            status: expect.any(Object),
            recipient: expect.any(Object),
            read: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IEmail should create a new form with FormGroup', () => {
        const formGroup = service.createEmailFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subject: expect.any(Object),
            content: expect.any(Object),
            receivedDate: expect.any(Object),
            deadline: expect.any(Object),
            status: expect.any(Object),
            recipient: expect.any(Object),
            read: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getEmail', () => {
      it('should return NewEmail for default Email initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEmailFormGroup(sampleWithNewData);

        const email = service.getEmail(formGroup) as any;

        expect(email).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmail for empty Email initial value', () => {
        const formGroup = service.createEmailFormGroup();

        const email = service.getEmail(formGroup) as any;

        expect(email).toMatchObject({});
      });

      it('should return IEmail', () => {
        const formGroup = service.createEmailFormGroup(sampleWithRequiredData);

        const email = service.getEmail(formGroup) as any;

        expect(email).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmail should not enable id FormControl', () => {
        const formGroup = service.createEmailFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmail should disable id FormControl', () => {
        const formGroup = service.createEmailFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
