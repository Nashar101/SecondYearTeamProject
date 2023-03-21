import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAntiProcrastinationList, NewAntiProcrastinationList } from '../anti-procrastination-list.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAntiProcrastinationList for edit and NewAntiProcrastinationListFormGroupInput for create.
 */
type AntiProcrastinationListFormGroupInput = IAntiProcrastinationList | PartialWithRequiredKeyOf<NewAntiProcrastinationList>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAntiProcrastinationList | NewAntiProcrastinationList> = Omit<T, 'dueDate'> & {
  dueDate?: string | null;
};

type AntiProcrastinationListFormRawValue = FormValueOf<IAntiProcrastinationList>;

type NewAntiProcrastinationListFormRawValue = FormValueOf<NewAntiProcrastinationList>;

type AntiProcrastinationListFormDefaults = Pick<NewAntiProcrastinationList, 'id' | 'dueDate'>;

type AntiProcrastinationListFormGroupContent = {
  id: FormControl<AntiProcrastinationListFormRawValue['id'] | NewAntiProcrastinationList['id']>;
  link: FormControl<AntiProcrastinationListFormRawValue['link']>;
  type: FormControl<AntiProcrastinationListFormRawValue['type']>;
  days: FormControl<AntiProcrastinationListFormRawValue['days']>;
  hours: FormControl<AntiProcrastinationListFormRawValue['hours']>;
  minutes: FormControl<AntiProcrastinationListFormRawValue['minutes']>;
  seconds: FormControl<AntiProcrastinationListFormRawValue['seconds']>;
  empty: FormControl<AntiProcrastinationListFormRawValue['empty']>;
  idk: FormControl<AntiProcrastinationListFormRawValue['idk']>;
  idk1: FormControl<AntiProcrastinationListFormRawValue['idk1']>;
  dueDate: FormControl<AntiProcrastinationListFormRawValue['dueDate']>;
};

export type AntiProcrastinationListFormGroup = FormGroup<AntiProcrastinationListFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AntiProcrastinationListFormService {
  createAntiProcrastinationListFormGroup(
    antiProcrastinationList: AntiProcrastinationListFormGroupInput = { id: null }
  ): AntiProcrastinationListFormGroup {
    const antiProcrastinationListRawValue = this.convertAntiProcrastinationListToAntiProcrastinationListRawValue({
      ...this.getFormDefaults(),
      ...antiProcrastinationList,
    });
    return new FormGroup<AntiProcrastinationListFormGroupContent>({
      id: new FormControl(
        { value: antiProcrastinationListRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      link: new FormControl(antiProcrastinationListRawValue.link),
      type: new FormControl(antiProcrastinationListRawValue.type),
      days: new FormControl(antiProcrastinationListRawValue.days),
      hours: new FormControl(antiProcrastinationListRawValue.hours),
      minutes: new FormControl(antiProcrastinationListRawValue.minutes),
      seconds: new FormControl(antiProcrastinationListRawValue.seconds),
      empty: new FormControl(antiProcrastinationListRawValue.empty),
      idk: new FormControl(antiProcrastinationListRawValue.idk),
      idk1: new FormControl(antiProcrastinationListRawValue.idk1),
      dueDate: new FormControl(antiProcrastinationListRawValue.dueDate),
    });
  }

  getAntiProcrastinationList(form: AntiProcrastinationListFormGroup): IAntiProcrastinationList | NewAntiProcrastinationList {
    return this.convertAntiProcrastinationListRawValueToAntiProcrastinationList(
      form.getRawValue() as AntiProcrastinationListFormRawValue | NewAntiProcrastinationListFormRawValue
    );
  }

  resetForm(form: AntiProcrastinationListFormGroup, antiProcrastinationList: AntiProcrastinationListFormGroupInput): void {
    const antiProcrastinationListRawValue = this.convertAntiProcrastinationListToAntiProcrastinationListRawValue({
      ...this.getFormDefaults(),
      ...antiProcrastinationList,
    });
    form.reset(
      {
        ...antiProcrastinationListRawValue,
        id: { value: antiProcrastinationListRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AntiProcrastinationListFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dueDate: currentTime,
    };
  }

  private convertAntiProcrastinationListRawValueToAntiProcrastinationList(
    rawAntiProcrastinationList: AntiProcrastinationListFormRawValue | NewAntiProcrastinationListFormRawValue
  ): IAntiProcrastinationList | NewAntiProcrastinationList {
    return {
      ...rawAntiProcrastinationList,
      dueDate: dayjs(rawAntiProcrastinationList.dueDate, DATE_TIME_FORMAT),
    };
  }

  private convertAntiProcrastinationListToAntiProcrastinationListRawValue(
    antiProcrastinationList: IAntiProcrastinationList | (Partial<NewAntiProcrastinationList> & AntiProcrastinationListFormDefaults)
  ): AntiProcrastinationListFormRawValue | PartialWithRequiredKeyOf<NewAntiProcrastinationListFormRawValue> {
    return {
      ...antiProcrastinationList,
      dueDate: antiProcrastinationList.dueDate ? antiProcrastinationList.dueDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
