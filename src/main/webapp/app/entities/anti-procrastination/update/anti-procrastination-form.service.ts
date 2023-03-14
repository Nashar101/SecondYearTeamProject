import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAntiProcrastination, NewAntiProcrastination } from '../anti-procrastination.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAntiProcrastination for edit and NewAntiProcrastinationFormGroupInput for create.
 */
type AntiProcrastinationFormGroupInput = IAntiProcrastination | PartialWithRequiredKeyOf<NewAntiProcrastination>;

type AntiProcrastinationFormDefaults = Pick<NewAntiProcrastination, 'id' | 'type'>;

type AntiProcrastinationFormGroupContent = {
  id: FormControl<IAntiProcrastination['id'] | NewAntiProcrastination['id']>;
  url: FormControl<IAntiProcrastination['url']>;
  type: FormControl<IAntiProcrastination['type']>;
  days: FormControl<IAntiProcrastination['days']>;
  hours: FormControl<IAntiProcrastination['hours']>;
  minutes: FormControl<IAntiProcrastination['minutes']>;
  seconds: FormControl<IAntiProcrastination['seconds']>;
};

export type AntiProcrastinationFormGroup = FormGroup<AntiProcrastinationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AntiProcrastinationFormService {
  createAntiProcrastinationFormGroup(antiProcrastination: AntiProcrastinationFormGroupInput = { id: null }): AntiProcrastinationFormGroup {
    const antiProcrastinationRawValue = {
      ...this.getFormDefaults(),
      ...antiProcrastination,
    };
    return new FormGroup<AntiProcrastinationFormGroupContent>({
      id: new FormControl(
        { value: antiProcrastinationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      url: new FormControl(antiProcrastinationRawValue.url, {
        validators: [Validators.required],
      }),
      type: new FormControl(antiProcrastinationRawValue.type, {
        validators: [Validators.required],
      }),
      days: new FormControl(antiProcrastinationRawValue.days, {
        validators: [Validators.required],
      }),
      hours: new FormControl(antiProcrastinationRawValue.hours, {
        validators: [Validators.required],
      }),
      minutes: new FormControl(antiProcrastinationRawValue.minutes, {
        validators: [Validators.required],
      }),
      seconds: new FormControl(antiProcrastinationRawValue.seconds, {
        validators: [Validators.required],
      }),
    });
  }

  getAntiProcrastination(form: AntiProcrastinationFormGroup): IAntiProcrastination | NewAntiProcrastination {
    return form.getRawValue() as IAntiProcrastination | NewAntiProcrastination;
  }

  resetForm(form: AntiProcrastinationFormGroup, antiProcrastination: AntiProcrastinationFormGroupInput): void {
    const antiProcrastinationRawValue = { ...this.getFormDefaults(), ...antiProcrastination };
    form.reset(
      {
        ...antiProcrastinationRawValue,
        id: { value: antiProcrastinationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AntiProcrastinationFormDefaults {
    return {
      id: null,
      type: false,
    };
  }
}
