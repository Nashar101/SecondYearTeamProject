import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HistoryTwoFormService, HistoryTwoFormGroup } from './history-two-form.service';
import { IHistoryTwo } from '../history-two.model';
import { HistoryTwoService } from '../service/history-two.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-history-two-update',
  templateUrl: './history-two-update.component.html',
})
export class HistoryTwoUpdateComponent implements OnInit {
  isSaving = false;
  historyTwo: IHistoryTwo | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: HistoryTwoFormGroup = this.historyTwoFormService.createHistoryTwoFormGroup();

  constructor(
    protected historyTwoService: HistoryTwoService,
    protected historyTwoFormService: HistoryTwoFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ historyTwo }) => {
      this.historyTwo = historyTwo;
      if (historyTwo) {
        this.updateForm(historyTwo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const historyTwo = this.historyTwoFormService.getHistoryTwo(this.editForm);
    if (historyTwo.id !== null) {
      this.subscribeToSaveResponse(this.historyTwoService.update(historyTwo));
    } else {
      this.subscribeToSaveResponse(this.historyTwoService.create(historyTwo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistoryTwo>>): void {
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

  protected updateForm(historyTwo: IHistoryTwo): void {
    this.historyTwo = historyTwo;
    this.historyTwoFormService.resetForm(this.editForm, historyTwo);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, historyTwo.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.historyTwo?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
