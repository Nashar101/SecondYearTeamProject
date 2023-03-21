import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDiaryPage, NewDiaryPage } from '../diary-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDiaryPage for edit and NewDiaryPageFormGroupInput for create.
 */
type DiaryPageFormGroupInput = IDiaryPage | PartialWithRequiredKeyOf<NewDiaryPage>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDiaryPage | NewDiaryPage> = Omit<T, 'pageDate' | 'creationTime' | 'lastEditTime'> & {
  pageDate?: string | null;
  creationTime?: string | null;
  lastEditTime?: string | null;
};

type DiaryPageFormRawValue = FormValueOf<IDiaryPage>;

type NewDiaryPageFormRawValue = FormValueOf<NewDiaryPage>;

type DiaryPageFormDefaults = Pick<NewDiaryPage, 'id' | 'pageDate' | 'creationTime' | 'lastEditTime'>;

type DiaryPageFormGroupContent = {
  id: FormControl<DiaryPageFormRawValue['id'] | NewDiaryPage['id']>;
  pageDate: FormControl<DiaryPageFormRawValue['pageDate']>;
  pageDescription: FormControl<DiaryPageFormRawValue['pageDescription']>;
  creationTime: FormControl<DiaryPageFormRawValue['creationTime']>;
  lastEditTime: FormControl<DiaryPageFormRawValue['lastEditTime']>;
  user: FormControl<DiaryPageFormRawValue['user']>;
};

export type DiaryPageFormGroup = FormGroup<DiaryPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DiaryPageFormService {
  createDiaryPageFormGroup(diaryPage: DiaryPageFormGroupInput = { id: null }): DiaryPageFormGroup {
    const diaryPageRawValue = this.convertDiaryPageToDiaryPageRawValue({
      ...this.getFormDefaults(),
      ...diaryPage,
    });
    return new FormGroup<DiaryPageFormGroupContent>({
      id: new FormControl(
        { value: diaryPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      pageDate: new FormControl(diaryPageRawValue.pageDate, {
        validators: [Validators.required],
      }),
      pageDescription: new FormControl(diaryPageRawValue.pageDescription),
      creationTime: new FormControl(diaryPageRawValue.creationTime, {
        validators: [Validators.required],
      }),
      lastEditTime: new FormControl(diaryPageRawValue.lastEditTime, {
        validators: [Validators.required],
      }),
      user: new FormControl(diaryPageRawValue.user),
    });
  }

  getDiaryPage(form: DiaryPageFormGroup): IDiaryPage | NewDiaryPage {
    return this.convertDiaryPageRawValueToDiaryPage(form.getRawValue() as DiaryPageFormRawValue | NewDiaryPageFormRawValue);
  }

  resetForm(form: DiaryPageFormGroup, diaryPage: DiaryPageFormGroupInput): void {
    const diaryPageRawValue = this.convertDiaryPageToDiaryPageRawValue({ ...this.getFormDefaults(), ...diaryPage });
    form.reset(
      {
        ...diaryPageRawValue,
        id: { value: diaryPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DiaryPageFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      pageDate: currentTime,
      creationTime: currentTime,
      lastEditTime: currentTime,
    };
  }

  private convertDiaryPageRawValueToDiaryPage(rawDiaryPage: DiaryPageFormRawValue | NewDiaryPageFormRawValue): IDiaryPage | NewDiaryPage {
    return {
      ...rawDiaryPage,
      pageDate: dayjs(rawDiaryPage.pageDate, DATE_TIME_FORMAT),
      creationTime: dayjs(rawDiaryPage.creationTime, DATE_TIME_FORMAT),
      lastEditTime: dayjs(rawDiaryPage.lastEditTime, DATE_TIME_FORMAT),
    };
  }

  private convertDiaryPageToDiaryPageRawValue(
    diaryPage: IDiaryPage | (Partial<NewDiaryPage> & DiaryPageFormDefaults)
  ): DiaryPageFormRawValue | PartialWithRequiredKeyOf<NewDiaryPageFormRawValue> {
    return {
      ...diaryPage,
      pageDate: diaryPage.pageDate ? diaryPage.pageDate.format(DATE_TIME_FORMAT) : undefined,
      creationTime: diaryPage.creationTime ? diaryPage.creationTime.format(DATE_TIME_FORMAT) : undefined,
      lastEditTime: diaryPage.lastEditTime ? diaryPage.lastEditTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
