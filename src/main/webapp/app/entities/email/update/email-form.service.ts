import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmail, NewEmail } from '../email.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmail for edit and NewEmailFormGroupInput for create.
 */
type EmailFormGroupInput = IEmail | PartialWithRequiredKeyOf<NewEmail>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEmail | NewEmail> = Omit<T, 'receivedDate' | 'deadline'> & {
  receivedDate?: string | null;
  deadline?: string | null;
};

type EmailFormRawValue = FormValueOf<IEmail>;

type NewEmailFormRawValue = FormValueOf<NewEmail>;

type EmailFormDefaults = Pick<NewEmail, 'id' | 'receivedDate' | 'deadline' | 'read'>;

type EmailFormGroupContent = {
  id: FormControl<EmailFormRawValue['id'] | NewEmail['id']>;
  subject: FormControl<EmailFormRawValue['subject']>;
  content: FormControl<EmailFormRawValue['content']>;
  receivedDate: FormControl<EmailFormRawValue['receivedDate']>;
  deadline: FormControl<EmailFormRawValue['deadline']>;
  status: FormControl<EmailFormRawValue['status']>;
  recipient: FormControl<EmailFormRawValue['recipient']>;
  read: FormControl<EmailFormRawValue['read']>;
  user: FormControl<EmailFormRawValue['user']>;
};

export type EmailFormGroup = FormGroup<EmailFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmailFormService {
  createEmailFormGroup(email: EmailFormGroupInput = { id: null }): EmailFormGroup {
    const emailRawValue = this.convertEmailToEmailRawValue({
      ...this.getFormDefaults(),
      ...email,
    });
    return new FormGroup<EmailFormGroupContent>({
      id: new FormControl(
        { value: emailRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      subject: new FormControl(emailRawValue.subject),
      content: new FormControl(emailRawValue.content),
      receivedDate: new FormControl(emailRawValue.receivedDate),
      deadline: new FormControl(emailRawValue.deadline),
      status: new FormControl(emailRawValue.status),
      recipient: new FormControl(emailRawValue.recipient),
      read: new FormControl(emailRawValue.read),
      user: new FormControl(emailRawValue.user),
    });
  }

  getEmail(form: EmailFormGroup): IEmail | NewEmail {
    return this.convertEmailRawValueToEmail(form.getRawValue() as EmailFormRawValue | NewEmailFormRawValue);
  }

  resetForm(form: EmailFormGroup, email: EmailFormGroupInput): void {
    const emailRawValue = this.convertEmailToEmailRawValue({ ...this.getFormDefaults(), ...email });
    form.reset(
      {
        ...emailRawValue,
        id: { value: emailRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EmailFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      receivedDate: currentTime,
      deadline: currentTime,
      read: false,
    };
  }

  private convertEmailRawValueToEmail(rawEmail: EmailFormRawValue | NewEmailFormRawValue): IEmail | NewEmail {
    return {
      ...rawEmail,
      receivedDate: dayjs(rawEmail.receivedDate, DATE_TIME_FORMAT),
      deadline: dayjs(rawEmail.deadline, DATE_TIME_FORMAT),
    };
  }

  private convertEmailToEmailRawValue(
    email: IEmail | (Partial<NewEmail> & EmailFormDefaults)
  ): EmailFormRawValue | PartialWithRequiredKeyOf<NewEmailFormRawValue> {
    return {
      ...email,
      receivedDate: email.receivedDate ? email.receivedDate.format(DATE_TIME_FORMAT) : undefined,
      deadline: email.deadline ? email.deadline.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
