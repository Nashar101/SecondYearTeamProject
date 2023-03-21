import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IScheduleEvent, NewScheduleEvent } from '../schedule-event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IScheduleEvent for edit and NewScheduleEventFormGroupInput for create.
 */
type ScheduleEventFormGroupInput = IScheduleEvent | PartialWithRequiredKeyOf<NewScheduleEvent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IScheduleEvent | NewScheduleEvent> = Omit<T, 'startTime' | 'endTime' | 'date'> & {
  startTime?: string | null;
  endTime?: string | null;
  date?: string | null;
};

type ScheduleEventFormRawValue = FormValueOf<IScheduleEvent>;

type NewScheduleEventFormRawValue = FormValueOf<NewScheduleEvent>;

type ScheduleEventFormDefaults = Pick<NewScheduleEvent, 'id' | 'startTime' | 'endTime' | 'date'>;

type ScheduleEventFormGroupContent = {
  id: FormControl<ScheduleEventFormRawValue['id'] | NewScheduleEvent['id']>;
  startTime: FormControl<ScheduleEventFormRawValue['startTime']>;
  endTime: FormControl<ScheduleEventFormRawValue['endTime']>;
  heading: FormControl<ScheduleEventFormRawValue['heading']>;
  date: FormControl<ScheduleEventFormRawValue['date']>;
  details: FormControl<ScheduleEventFormRawValue['details']>;
  user: FormControl<ScheduleEventFormRawValue['user']>;
};

export type ScheduleEventFormGroup = FormGroup<ScheduleEventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ScheduleEventFormService {
  createScheduleEventFormGroup(scheduleEvent: ScheduleEventFormGroupInput = { id: null }): ScheduleEventFormGroup {
    const scheduleEventRawValue = this.convertScheduleEventToScheduleEventRawValue({
      ...this.getFormDefaults(),
      ...scheduleEvent,
    });
    return new FormGroup<ScheduleEventFormGroupContent>({
      id: new FormControl(
        { value: scheduleEventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startTime: new FormControl(scheduleEventRawValue.startTime),
      endTime: new FormControl(scheduleEventRawValue.endTime),
      heading: new FormControl(scheduleEventRawValue.heading),
      date: new FormControl(scheduleEventRawValue.date),
      details: new FormControl(scheduleEventRawValue.details),
      user: new FormControl(scheduleEventRawValue.user),
    });
  }

  getScheduleEvent(form: ScheduleEventFormGroup): IScheduleEvent | NewScheduleEvent {
    return this.convertScheduleEventRawValueToScheduleEvent(form.getRawValue() as ScheduleEventFormRawValue | NewScheduleEventFormRawValue);
  }

  resetForm(form: ScheduleEventFormGroup, scheduleEvent: ScheduleEventFormGroupInput): void {
    const scheduleEventRawValue = this.convertScheduleEventToScheduleEventRawValue({ ...this.getFormDefaults(), ...scheduleEvent });
    form.reset(
      {
        ...scheduleEventRawValue,
        id: { value: scheduleEventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ScheduleEventFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTime: currentTime,
      endTime: currentTime,
      date: currentTime,
    };
  }

  private convertScheduleEventRawValueToScheduleEvent(
    rawScheduleEvent: ScheduleEventFormRawValue | NewScheduleEventFormRawValue
  ): IScheduleEvent | NewScheduleEvent {
    return {
      ...rawScheduleEvent,
      startTime: dayjs(rawScheduleEvent.startTime, DATE_TIME_FORMAT),
      endTime: dayjs(rawScheduleEvent.endTime, DATE_TIME_FORMAT),
      date: dayjs(rawScheduleEvent.date, DATE_TIME_FORMAT),
    };
  }

  private convertScheduleEventToScheduleEventRawValue(
    scheduleEvent: IScheduleEvent | (Partial<NewScheduleEvent> & ScheduleEventFormDefaults)
  ): ScheduleEventFormRawValue | PartialWithRequiredKeyOf<NewScheduleEventFormRawValue> {
    return {
      ...scheduleEvent,
      startTime: scheduleEvent.startTime ? scheduleEvent.startTime.format(DATE_TIME_FORMAT) : undefined,
      endTime: scheduleEvent.endTime ? scheduleEvent.endTime.format(DATE_TIME_FORMAT) : undefined,
      date: scheduleEvent.date ? scheduleEvent.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
