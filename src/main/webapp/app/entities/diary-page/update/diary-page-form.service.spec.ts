import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../diary-page.test-samples';

import { DiaryPageFormService } from './diary-page-form.service';

describe('DiaryPage Form Service', () => {
  let service: DiaryPageFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiaryPageFormService);
  });

  describe('Service methods', () => {
    describe('createDiaryPageFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDiaryPageFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            pageDate: expect.any(Object),
            pageDescription: expect.any(Object),
            creationTime: expect.any(Object),
            lastEditTime: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IDiaryPage should create a new form with FormGroup', () => {
        const formGroup = service.createDiaryPageFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            pageDate: expect.any(Object),
            pageDescription: expect.any(Object),
            creationTime: expect.any(Object),
            lastEditTime: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getDiaryPage', () => {
      it('should return NewDiaryPage for default DiaryPage initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDiaryPageFormGroup(sampleWithNewData);

        const diaryPage = service.getDiaryPage(formGroup) as any;

        expect(diaryPage).toMatchObject(sampleWithNewData);
      });

      it('should return NewDiaryPage for empty DiaryPage initial value', () => {
        const formGroup = service.createDiaryPageFormGroup();

        const diaryPage = service.getDiaryPage(formGroup) as any;

        expect(diaryPage).toMatchObject({});
      });

      it('should return IDiaryPage', () => {
        const formGroup = service.createDiaryPageFormGroup(sampleWithRequiredData);

        const diaryPage = service.getDiaryPage(formGroup) as any;

        expect(diaryPage).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDiaryPage should not enable id FormControl', () => {
        const formGroup = service.createDiaryPageFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDiaryPage should disable id FormControl', () => {
        const formGroup = service.createDiaryPageFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
