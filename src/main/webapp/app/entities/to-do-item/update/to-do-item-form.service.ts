import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IToDoItem, NewToDoItem } from '../to-do-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IToDoItem for edit and NewToDoItemFormGroupInput for create.
 */
type ToDoItemFormGroupInput = IToDoItem | PartialWithRequiredKeyOf<NewToDoItem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IToDoItem | NewToDoItem> = Omit<T, 'toDoItemStatus'> & {
  toDoItemStatus?: string | null;
};

type ToDoItemFormRawValue = FormValueOf<IToDoItem>;

type NewToDoItemFormRawValue = FormValueOf<NewToDoItem>;

type ToDoItemFormDefaults = Pick<NewToDoItem, 'id' | 'toDoItemStatus'>;

type ToDoItemFormGroupContent = {
  id: FormControl<ToDoItemFormRawValue['id'] | NewToDoItem['id']>;
  toDoItemHeading: FormControl<ToDoItemFormRawValue['toDoItemHeading']>;
  toDoItemDescription: FormControl<ToDoItemFormRawValue['toDoItemDescription']>;
  toDoItemStatus: FormControl<ToDoItemFormRawValue['toDoItemStatus']>;
  diaryPage: FormControl<ToDoItemFormRawValue['diaryPage']>;
};

export type ToDoItemFormGroup = FormGroup<ToDoItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ToDoItemFormService {
  createToDoItemFormGroup(toDoItem: ToDoItemFormGroupInput = { id: null }): ToDoItemFormGroup {
    const toDoItemRawValue = this.convertToDoItemToToDoItemRawValue({
      ...this.getFormDefaults(),
      ...toDoItem,
    });
    return new FormGroup<ToDoItemFormGroupContent>({
      id: new FormControl(
        { value: toDoItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      toDoItemHeading: new FormControl(toDoItemRawValue.toDoItemHeading, {
        validators: [Validators.required],
      }),
      toDoItemDescription: new FormControl(toDoItemRawValue.toDoItemDescription),
      toDoItemStatus: new FormControl(toDoItemRawValue.toDoItemStatus, {
        validators: [Validators.required],
      }),
      diaryPage: new FormControl(toDoItemRawValue.diaryPage),
    });
  }

  getToDoItem(form: ToDoItemFormGroup): IToDoItem | NewToDoItem {
    return this.convertToDoItemRawValueToToDoItem(form.getRawValue() as ToDoItemFormRawValue | NewToDoItemFormRawValue);
  }

  resetForm(form: ToDoItemFormGroup, toDoItem: ToDoItemFormGroupInput): void {
    const toDoItemRawValue = this.convertToDoItemToToDoItemRawValue({ ...this.getFormDefaults(), ...toDoItem });
    form.reset(
      {
        ...toDoItemRawValue,
        id: { value: toDoItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ToDoItemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      toDoItemStatus: currentTime,
    };
  }

  private convertToDoItemRawValueToToDoItem(rawToDoItem: ToDoItemFormRawValue | NewToDoItemFormRawValue): IToDoItem | NewToDoItem {
    return {
      ...rawToDoItem,
      toDoItemStatus: dayjs(rawToDoItem.toDoItemStatus, DATE_TIME_FORMAT),
    };
  }

  private convertToDoItemToToDoItemRawValue(
    toDoItem: IToDoItem | (Partial<NewToDoItem> & ToDoItemFormDefaults)
  ): ToDoItemFormRawValue | PartialWithRequiredKeyOf<NewToDoItemFormRawValue> {
    return {
      ...toDoItem,
      toDoItemStatus: toDoItem.toDoItemStatus ? toDoItem.toDoItemStatus.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
