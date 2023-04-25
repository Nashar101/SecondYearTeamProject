import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExtensionID, NewExtensionID } from '../extension-id.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExtensionID for edit and NewExtensionIDFormGroupInput for create.
 */
type ExtensionIDFormGroupInput = IExtensionID | PartialWithRequiredKeyOf<NewExtensionID>;

type ExtensionIDFormDefaults = Pick<NewExtensionID, 'id'>;

type ExtensionIDFormGroupContent = {
  id: FormControl<IExtensionID['id'] | NewExtensionID['id']>;
  extensionID: FormControl<IExtensionID['extensionID']>;
  user: FormControl<IExtensionID['user']>;
};

export type ExtensionIDFormGroup = FormGroup<ExtensionIDFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExtensionIDFormService {
  createExtensionIDFormGroup(extensionID: ExtensionIDFormGroupInput = { id: null }): ExtensionIDFormGroup {
    const extensionIDRawValue = {
      ...this.getFormDefaults(),
      ...extensionID,
    };
    return new FormGroup<ExtensionIDFormGroupContent>({
      id: new FormControl(
        { value: extensionIDRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      extensionID: new FormControl(extensionIDRawValue.extensionID),
      user: new FormControl(extensionIDRawValue.user),
    });
  }

  getExtensionID(form: ExtensionIDFormGroup): IExtensionID | NewExtensionID {
    return form.getRawValue() as IExtensionID | NewExtensionID;
  }

  resetForm(form: ExtensionIDFormGroup, extensionID: ExtensionIDFormGroupInput): void {
    const extensionIDRawValue = { ...this.getFormDefaults(), ...extensionID };
    form.reset(
      {
        ...extensionIDRawValue,
        id: { value: extensionIDRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExtensionIDFormDefaults {
    return {
      id: null,
    };
  }
}
