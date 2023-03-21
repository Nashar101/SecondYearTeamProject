import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DiaryPageFormService, DiaryPageFormGroup } from './diary-page-form.service';
import { IDiaryPage } from '../diary-page.model';
import { DiaryPageService } from '../service/diary-page.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-diary-page-update',
  templateUrl: './diary-page-update.component.html',
})
export class DiaryPageUpdateComponent implements OnInit {
  isSaving = false;
  diaryPage: IDiaryPage | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: DiaryPageFormGroup = this.diaryPageFormService.createDiaryPageFormGroup();

  constructor(
    protected diaryPageService: DiaryPageService,
    protected diaryPageFormService: DiaryPageFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diaryPage }) => {
      this.diaryPage = diaryPage;
      if (diaryPage) {
        this.updateForm(diaryPage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const diaryPage = this.diaryPageFormService.getDiaryPage(this.editForm);
    if (diaryPage.id !== null) {
      this.subscribeToSaveResponse(this.diaryPageService.update(diaryPage));
    } else {
      this.subscribeToSaveResponse(this.diaryPageService.create(diaryPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiaryPage>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(diaryPage: IDiaryPage): void {
    this.diaryPage = diaryPage;
    this.diaryPageFormService.resetForm(this.editForm, diaryPage);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, diaryPage.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.diaryPage?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
