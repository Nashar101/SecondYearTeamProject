import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../extension-id.test-samples';

import { ExtensionIDFormService } from './extension-id-form.service';

describe('ExtensionID Form Service', () => {
  let service: ExtensionIDFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensionIDFormService);
  });

  describe('Service methods', () => {
    describe('createExtensionIDFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExtensionIDFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            extensionID: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IExtensionID should create a new form with FormGroup', () => {
        const formGroup = service.createExtensionIDFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            extensionID: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getExtensionID', () => {
      it('should return NewExtensionID for default ExtensionID initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createExtensionIDFormGroup(sampleWithNewData);

        const extensionID = service.getExtensionID(formGroup) as any;

        expect(extensionID).toMatchObject(sampleWithNewData);
      });

      it('should return NewExtensionID for empty ExtensionID initial value', () => {
        const formGroup = service.createExtensionIDFormGroup();

        const extensionID = service.getExtensionID(formGroup) as any;

        expect(extensionID).toMatchObject({});
      });

      it('should return IExtensionID', () => {
        const formGroup = service.createExtensionIDFormGroup(sampleWithRequiredData);

        const extensionID = service.getExtensionID(formGroup) as any;

        expect(extensionID).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IExtensionID should not enable id FormControl', () => {
        const formGroup = service.createExtensionIDFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExtensionID should disable id FormControl', () => {
        const formGroup = service.createExtensionIDFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
