import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITesting, NewTesting } from '../testing.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITesting for edit and NewTestingFormGroupInput for create.
 */
type TestingFormGroupInput = ITesting | PartialWithRequiredKeyOf<NewTesting>;

type TestingFormDefaults = Pick<NewTesting, 'id'>;

type TestingFormGroupContent = {
  id: FormControl<ITesting['id'] | NewTesting['id']>;
  suwi: FormControl<ITesting['suwi']>;
};

export type TestingFormGroup = FormGroup<TestingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TestingFormService {
  createTestingFormGroup(testing: TestingFormGroupInput = { id: null }): TestingFormGroup {
    const testingRawValue = {
      ...this.getFormDefaults(),
      ...testing,
    };
    return new FormGroup<TestingFormGroupContent>({
      id: new FormControl(
        { value: testingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      suwi: new FormControl(testingRawValue.suwi, {
        validators: [Validators.required],
      }),
    });
  }

  getTesting(form: TestingFormGroup): ITesting | NewTesting {
    return form.getRawValue() as ITesting | NewTesting;
  }

  resetForm(form: TestingFormGroup, testing: TestingFormGroupInput): void {
    const testingRawValue = { ...this.getFormDefaults(), ...testing };
    form.reset(
      {
        ...testingRawValue,
        id: { value: testingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TestingFormDefaults {
    return {
      id: null,
    };
  }
}
