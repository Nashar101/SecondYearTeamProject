import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHistory, NewHistory } from '../history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHistory for edit and NewHistoryFormGroupInput for create.
 */
type HistoryFormGroupInput = IHistory | PartialWithRequiredKeyOf<NewHistory>;

type HistoryFormDefaults = Pick<NewHistory, 'id'>;

type HistoryFormGroupContent = {
  id: FormControl<IHistory['id'] | NewHistory['id']>;
  subject: FormControl<IHistory['subject']>;
  subjectScore: FormControl<IHistory['subjectScore']>;
  subjectTarget: FormControl<IHistory['subjectTarget']>;
  upcomingTest: FormControl<IHistory['upcomingTest']>;
  upcomingTestTarget: FormControl<IHistory['upcomingTestTarget']>;
  user: FormControl<IHistory['user']>;
};

export type HistoryFormGroup = FormGroup<HistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HistoryFormService {
  createHistoryFormGroup(history: HistoryFormGroupInput = { id: null }): HistoryFormGroup {
    const historyRawValue = {
      ...this.getFormDefaults(),
      ...history,
    };
    return new FormGroup<HistoryFormGroupContent>({
      id: new FormControl(
        { value: historyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      subject: new FormControl(historyRawValue.subject),
      subjectScore: new FormControl(historyRawValue.subjectScore),
      subjectTarget: new FormControl(historyRawValue.subjectTarget),
      upcomingTest: new FormControl(historyRawValue.upcomingTest),
      upcomingTestTarget: new FormControl(historyRawValue.upcomingTestTarget),
      user: new FormControl(historyRawValue.user),
    });
  }

  getHistory(form: HistoryFormGroup): IHistory | NewHistory {
    return form.getRawValue() as IHistory | NewHistory;
  }

  resetForm(form: HistoryFormGroup, history: HistoryFormGroupInput): void {
    const historyRawValue = { ...this.getFormDefaults(), ...history };
    form.reset(
      {
        ...historyRawValue,
        id: { value: historyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HistoryFormDefaults {
    return {
      id: null,
    };
  }
}
