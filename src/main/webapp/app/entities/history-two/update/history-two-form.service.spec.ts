import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../history-two.test-samples';

import { HistoryTwoFormService } from './history-two-form.service';

describe('HistoryTwo Form Service', () => {
  let service: HistoryTwoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryTwoFormService);
  });

  describe('Service methods', () => {
    describe('createHistoryTwoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createHistoryTwoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subject: expect.any(Object),
            subjectScore: expect.any(Object),
            subjectTarget: expect.any(Object),
            upcomingTest: expect.any(Object),
            upcomingTestTarget: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IHistoryTwo should create a new form with FormGroup', () => {
        const formGroup = service.createHistoryTwoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            subject: expect.any(Object),
            subjectScore: expect.any(Object),
            subjectTarget: expect.any(Object),
            upcomingTest: expect.any(Object),
            upcomingTestTarget: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getHistoryTwo', () => {
      it('should return NewHistoryTwo for default HistoryTwo initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createHistoryTwoFormGroup(sampleWithNewData);

        const historyTwo = service.getHistoryTwo(formGroup) as any;

        expect(historyTwo).toMatchObject(sampleWithNewData);
      });

      it('should return NewHistoryTwo for empty HistoryTwo initial value', () => {
        const formGroup = service.createHistoryTwoFormGroup();

        const historyTwo = service.getHistoryTwo(formGroup) as any;

        expect(historyTwo).toMatchObject({});
      });

      it('should return IHistoryTwo', () => {
        const formGroup = service.createHistoryTwoFormGroup(sampleWithRequiredData);

        const historyTwo = service.getHistoryTwo(formGroup) as any;

        expect(historyTwo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IHistoryTwo should not enable id FormControl', () => {
        const formGroup = service.createHistoryTwoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewHistoryTwo should disable id FormControl', () => {
        const formGroup = service.createHistoryTwoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
