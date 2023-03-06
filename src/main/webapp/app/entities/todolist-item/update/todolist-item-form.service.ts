import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITodolistItem, NewTodolistItem } from '../todolist-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITodolistItem for edit and NewTodolistItemFormGroupInput for create.
 */
type TodolistItemFormGroupInput = ITodolistItem | PartialWithRequiredKeyOf<NewTodolistItem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITodolistItem | NewTodolistItem> = Omit<T, 'creationTime' | 'lastEditTime'> & {
  creationTime?: string | null;
  lastEditTime?: string | null;
};

type TodolistItemFormRawValue = FormValueOf<ITodolistItem>;

type NewTodolistItemFormRawValue = FormValueOf<NewTodolistItem>;

type TodolistItemFormDefaults = Pick<NewTodolistItem, 'id' | 'creationTime' | 'lastEditTime' | 'completed'>;

type TodolistItemFormGroupContent = {
  id: FormControl<TodolistItemFormRawValue['id'] | NewTodolistItem['id']>;
  heading: FormControl<TodolistItemFormRawValue['heading']>;
  description: FormControl<TodolistItemFormRawValue['description']>;
  creationTime: FormControl<TodolistItemFormRawValue['creationTime']>;
  lastEditTime: FormControl<TodolistItemFormRawValue['lastEditTime']>;
  completed: FormControl<TodolistItemFormRawValue['completed']>;
};

export type TodolistItemFormGroup = FormGroup<TodolistItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TodolistItemFormService {
  createTodolistItemFormGroup(todolistItem: TodolistItemFormGroupInput = { id: null }): TodolistItemFormGroup {
    const todolistItemRawValue = this.convertTodolistItemToTodolistItemRawValue({
      ...this.getFormDefaults(),
      ...todolistItem,
    });
    return new FormGroup<TodolistItemFormGroupContent>({
      id: new FormControl(
        { value: todolistItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      heading: new FormControl(todolistItemRawValue.heading, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(todolistItemRawValue.description, {
        validators: [Validators.required],
      }),
      creationTime: new FormControl(todolistItemRawValue.creationTime, {
        validators: [Validators.required],
      }),
      lastEditTime: new FormControl(todolistItemRawValue.lastEditTime, {
        validators: [Validators.required],
      }),
      completed: new FormControl(todolistItemRawValue.completed, {
        validators: [Validators.required],
      }),
    });
  }

  getTodolistItem(form: TodolistItemFormGroup): ITodolistItem | NewTodolistItem {
    return this.convertTodolistItemRawValueToTodolistItem(form.getRawValue() as TodolistItemFormRawValue | NewTodolistItemFormRawValue);
  }

  resetForm(form: TodolistItemFormGroup, todolistItem: TodolistItemFormGroupInput): void {
    const todolistItemRawValue = this.convertTodolistItemToTodolistItemRawValue({ ...this.getFormDefaults(), ...todolistItem });
    form.reset(
      {
        ...todolistItemRawValue,
        id: { value: todolistItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TodolistItemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      creationTime: currentTime,
      lastEditTime: currentTime,
      completed: false,
    };
  }

  private convertTodolistItemRawValueToTodolistItem(
    rawTodolistItem: TodolistItemFormRawValue | NewTodolistItemFormRawValue
  ): ITodolistItem | NewTodolistItem {
    return {
      ...rawTodolistItem,
      creationTime: dayjs(rawTodolistItem.creationTime, DATE_TIME_FORMAT),
      lastEditTime: dayjs(rawTodolistItem.lastEditTime, DATE_TIME_FORMAT),
    };
  }

  private convertTodolistItemToTodolistItemRawValue(
    todolistItem: ITodolistItem | (Partial<NewTodolistItem> & TodolistItemFormDefaults)
  ): TodolistItemFormRawValue | PartialWithRequiredKeyOf<NewTodolistItemFormRawValue> {
    return {
      ...todolistItem,
      creationTime: todolistItem.creationTime ? todolistItem.creationTime.format(DATE_TIME_FORMAT) : undefined,
      lastEditTime: todolistItem.lastEditTime ? todolistItem.lastEditTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
