import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAntiprocrastinationListTwo, NewAntiprocrastinationListTwo } from '../antiprocrastination-list-two.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAntiprocrastinationListTwo for edit and NewAntiprocrastinationListTwoFormGroupInput for create.
 */
type AntiprocrastinationListTwoFormGroupInput = IAntiprocrastinationListTwo | PartialWithRequiredKeyOf<NewAntiprocrastinationListTwo>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAntiprocrastinationListTwo | NewAntiprocrastinationListTwo> = Omit<T, 'dueDate'> & {
  dueDate?: string | null;
};

type AntiprocrastinationListTwoFormRawValue = FormValueOf<IAntiprocrastinationListTwo>;

type NewAntiprocrastinationListTwoFormRawValue = FormValueOf<NewAntiprocrastinationListTwo>;

type AntiprocrastinationListTwoFormDefaults = Pick<NewAntiprocrastinationListTwo, 'id' | 'dueDate'>;

type AntiprocrastinationListTwoFormGroupContent = {
  id: FormControl<AntiprocrastinationListTwoFormRawValue['id'] | NewAntiprocrastinationListTwo['id']>;
  link: FormControl<AntiprocrastinationListTwoFormRawValue['link']>;
  type: FormControl<AntiprocrastinationListTwoFormRawValue['type']>;
  days: FormControl<AntiprocrastinationListTwoFormRawValue['days']>;
  hours: FormControl<AntiprocrastinationListTwoFormRawValue['hours']>;
  minutes: FormControl<AntiprocrastinationListTwoFormRawValue['minutes']>;
  seconds: FormControl<AntiprocrastinationListTwoFormRawValue['seconds']>;
  empty: FormControl<AntiprocrastinationListTwoFormRawValue['empty']>;
  idk: FormControl<AntiprocrastinationListTwoFormRawValue['idk']>;
  idk1: FormControl<AntiprocrastinationListTwoFormRawValue['idk1']>;
  dueDate: FormControl<AntiprocrastinationListTwoFormRawValue['dueDate']>;
  user: FormControl<AntiprocrastinationListTwoFormRawValue['user']>;
};

export type AntiprocrastinationListTwoFormGroup = FormGroup<AntiprocrastinationListTwoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AntiprocrastinationListTwoFormService {
  createAntiprocrastinationListTwoFormGroup(
    antiprocrastinationListTwo: AntiprocrastinationListTwoFormGroupInput = { id: null }
  ): AntiprocrastinationListTwoFormGroup {
    const antiprocrastinationListTwoRawValue = this.convertAntiprocrastinationListTwoToAntiprocrastinationListTwoRawValue({
      ...this.getFormDefaults(),
      ...antiprocrastinationListTwo,
    });
    return new FormGroup<AntiprocrastinationListTwoFormGroupContent>({
      id: new FormControl(
        { value: antiprocrastinationListTwoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      link: new FormControl(antiprocrastinationListTwoRawValue.link),
      type: new FormControl(antiprocrastinationListTwoRawValue.type),
      days: new FormControl(antiprocrastinationListTwoRawValue.days),
      hours: new FormControl(antiprocrastinationListTwoRawValue.hours),
      minutes: new FormControl(antiprocrastinationListTwoRawValue.minutes),
      seconds: new FormControl(antiprocrastinationListTwoRawValue.seconds),
      empty: new FormControl(antiprocrastinationListTwoRawValue.empty),
      idk: new FormControl(antiprocrastinationListTwoRawValue.idk),
      idk1: new FormControl(antiprocrastinationListTwoRawValue.idk1),
      dueDate: new FormControl(antiprocrastinationListTwoRawValue.dueDate),
      user: new FormControl(antiprocrastinationListTwoRawValue.user),
    });
  }

  getAntiprocrastinationListTwo(form: AntiprocrastinationListTwoFormGroup): IAntiprocrastinationListTwo | NewAntiprocrastinationListTwo {
    return this.convertAntiprocrastinationListTwoRawValueToAntiprocrastinationListTwo(
      form.getRawValue() as AntiprocrastinationListTwoFormRawValue | NewAntiprocrastinationListTwoFormRawValue
    );
  }

  resetForm(form: AntiprocrastinationListTwoFormGroup, antiprocrastinationListTwo: AntiprocrastinationListTwoFormGroupInput): void {
    const antiprocrastinationListTwoRawValue = this.convertAntiprocrastinationListTwoToAntiprocrastinationListTwoRawValue({
      ...this.getFormDefaults(),
      ...antiprocrastinationListTwo,
    });
    form.reset(
      {
        ...antiprocrastinationListTwoRawValue,
        id: { value: antiprocrastinationListTwoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AntiprocrastinationListTwoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dueDate: currentTime,
    };
  }

  private convertAntiprocrastinationListTwoRawValueToAntiprocrastinationListTwo(
    rawAntiprocrastinationListTwo: AntiprocrastinationListTwoFormRawValue | NewAntiprocrastinationListTwoFormRawValue
  ): IAntiprocrastinationListTwo | NewAntiprocrastinationListTwo {
    return {
      ...rawAntiprocrastinationListTwo,
      dueDate: dayjs(rawAntiprocrastinationListTwo.dueDate, DATE_TIME_FORMAT),
    };
  }

  private convertAntiprocrastinationListTwoToAntiprocrastinationListTwoRawValue(
    antiprocrastinationListTwo:
      | IAntiprocrastinationListTwo
      | (Partial<NewAntiprocrastinationListTwo> & AntiprocrastinationListTwoFormDefaults)
  ): AntiprocrastinationListTwoFormRawValue | PartialWithRequiredKeyOf<NewAntiprocrastinationListTwoFormRawValue> {
    return {
      ...antiprocrastinationListTwo,
      dueDate: antiprocrastinationListTwo.dueDate ? antiprocrastinationListTwo.dueDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
