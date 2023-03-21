import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAlarm, NewAlarm } from '../alarm.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAlarm for edit and NewAlarmFormGroupInput for create.
 */
type AlarmFormGroupInput = IAlarm | PartialWithRequiredKeyOf<NewAlarm>;

type AlarmFormDefaults = Pick<NewAlarm, 'id'>;

type AlarmFormGroupContent = {
  id: FormControl<IAlarm['id'] | NewAlarm['id']>;
  alarmName: FormControl<IAlarm['alarmName']>;
  type: FormControl<IAlarm['type']>;
  hours: FormControl<IAlarm['hours']>;
  minutes: FormControl<IAlarm['minutes']>;
  seconds: FormControl<IAlarm['seconds']>;
  user: FormControl<IAlarm['user']>;
};

export type AlarmFormGroup = FormGroup<AlarmFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AlarmFormService {
  createAlarmFormGroup(alarm: AlarmFormGroupInput = { id: null }): AlarmFormGroup {
    const alarmRawValue = {
      ...this.getFormDefaults(),
      ...alarm,
    };
    return new FormGroup<AlarmFormGroupContent>({
      id: new FormControl(
        { value: alarmRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      alarmName: new FormControl(alarmRawValue.alarmName),
      type: new FormControl(alarmRawValue.type),
      hours: new FormControl(alarmRawValue.hours),
      minutes: new FormControl(alarmRawValue.minutes),
      seconds: new FormControl(alarmRawValue.seconds),
      user: new FormControl(alarmRawValue.user),
    });
  }

  getAlarm(form: AlarmFormGroup): IAlarm | NewAlarm {
    return form.getRawValue() as IAlarm | NewAlarm;
  }

  resetForm(form: AlarmFormGroup, alarm: AlarmFormGroupInput): void {
    const alarmRawValue = { ...this.getFormDefaults(), ...alarm };
    form.reset(
      {
        ...alarmRawValue,
        id: { value: alarmRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AlarmFormDefaults {
    return {
      id: null,
    };
  }
}
