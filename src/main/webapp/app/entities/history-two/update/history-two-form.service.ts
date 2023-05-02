import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHistoryTwo, NewHistoryTwo } from '../history-two.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHistoryTwo for edit and NewHistoryTwoFormGroupInput for create.
 */
type HistoryTwoFormGroupInput = IHistoryTwo | PartialWithRequiredKeyOf<NewHistoryTwo>;

type HistoryTwoFormDefaults = Pick<NewHistoryTwo, 'id'>;

type HistoryTwoFormGroupContent = {
  id: FormControl<IHistoryTwo['id'] | NewHistoryTwo['id']>;
  subject: FormControl<IHistoryTwo['subject']>;
  subjectScore: FormControl<IHistoryTwo['subjectScore']>;
  subjectTarget: FormControl<IHistoryTwo['subjectTarget']>;
  upcomingTest: FormControl<IHistoryTwo['upcomingTest']>;
  upcomingTestTarget: FormControl<IHistoryTwo['upcomingTestTarget']>;
  user: FormControl<IHistoryTwo['user']>;
};

export type HistoryTwoFormGroup = FormGroup<HistoryTwoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HistoryTwoFormService {
  createHistoryTwoFormGroup(historyTwo: HistoryTwoFormGroupInput = { id: null }): HistoryTwoFormGroup {
    const historyTwoRawValue = {
      ...this.getFormDefaults(),
      ...historyTwo,
    };
    return new FormGroup<HistoryTwoFormGroupContent>({
      id: new FormControl(
        { value: historyTwoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      subject: new FormControl(historyTwoRawValue.subject),
      subjectScore: new FormControl(historyTwoRawValue.subjectScore),
      subjectTarget: new FormControl(historyTwoRawValue.subjectTarget),
      upcomingTest: new FormControl(historyTwoRawValue.upcomingTest),
      upcomingTestTarget: new FormControl(historyTwoRawValue.upcomingTestTarget),
      user: new FormControl(historyTwoRawValue.user),
    });
  }

  getHistoryTwo(form: HistoryTwoFormGroup): IHistoryTwo | NewHistoryTwo {
    return form.getRawValue() as IHistoryTwo | NewHistoryTwo;
  }

  resetForm(form: HistoryTwoFormGroup, historyTwo: HistoryTwoFormGroupInput): void {
    const historyTwoRawValue = { ...this.getFormDefaults(), ...historyTwo };
    form.reset(
      {
        ...historyTwoRawValue,
        id: { value: historyTwoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HistoryTwoFormDefaults {
    return {
      id: null,
    };
  }
}
