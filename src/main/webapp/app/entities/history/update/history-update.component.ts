import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { HistoryFormService, HistoryFormGroup } from './history-form.service';
import { IHistory } from '../history.model';
import { HistoryService } from '../service/history.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-history-update',
  templateUrl: './history-update.component.html',
})
export class HistoryUpdateComponent implements OnInit {
  isSaving = false;
  history: IHistory | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: HistoryFormGroup = this.historyFormService.createHistoryFormGroup();

  constructor(
    protected historyService: HistoryService,
    protected historyFormService: HistoryFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ history }) => {
      this.history = history;
      if (history) {
        this.updateForm(history);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const history = this.historyFormService.getHistory(this.editForm);
    if (history.id !== null) {
      this.subscribeToSaveResponse(this.historyService.update(history));
    } else {
      this.subscribeToSaveResponse(this.historyService.create(history));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistory>>): void {
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

  protected updateForm(history: IHistory): void {
    this.history = history;
    this.historyFormService.resetForm(this.editForm, history);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, history.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.history?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
