import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ToDoItemFormService, ToDoItemFormGroup } from './to-do-item-form.service';
import { IToDoItem } from '../to-do-item.model';
import { ToDoItemService } from '../service/to-do-item.service';
import { IDiaryPage } from 'app/entities/diary-page/diary-page.model';
import { DiaryPageService } from 'app/entities/diary-page/service/diary-page.service';

@Component({
  selector: 'jhi-to-do-item-update',
  templateUrl: './to-do-item-update.component.html',
})
export class ToDoItemUpdateComponent implements OnInit {
  isSaving = false;
  toDoItem: IToDoItem | null = null;

  diaryPagesSharedCollection: IDiaryPage[] = [];

  editForm: ToDoItemFormGroup = this.toDoItemFormService.createToDoItemFormGroup();

  constructor(
    protected toDoItemService: ToDoItemService,
    protected toDoItemFormService: ToDoItemFormService,
    protected diaryPageService: DiaryPageService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDiaryPage = (o1: IDiaryPage | null, o2: IDiaryPage | null): boolean => this.diaryPageService.compareDiaryPage(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ toDoItem }) => {
      this.toDoItem = toDoItem;
      if (toDoItem) {
        this.updateForm(toDoItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const toDoItem = this.toDoItemFormService.getToDoItem(this.editForm);
    if (toDoItem.id !== null) {
      this.subscribeToSaveResponse(this.toDoItemService.update(toDoItem));
    } else {
      this.subscribeToSaveResponse(this.toDoItemService.create(toDoItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IToDoItem>>): void {
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

  protected updateForm(toDoItem: IToDoItem): void {
    this.toDoItem = toDoItem;
    this.toDoItemFormService.resetForm(this.editForm, toDoItem);

    this.diaryPagesSharedCollection = this.diaryPageService.addDiaryPageToCollectionIfMissing<IDiaryPage>(
      this.diaryPagesSharedCollection,
      toDoItem.diaryPage
    );
  }

  protected loadRelationshipsOptions(): void {
    this.diaryPageService
      .query()
      .pipe(map((res: HttpResponse<IDiaryPage[]>) => res.body ?? []))
      .pipe(
        map((diaryPages: IDiaryPage[]) =>
          this.diaryPageService.addDiaryPageToCollectionIfMissing<IDiaryPage>(diaryPages, this.toDoItem?.diaryPage)
        )
      )
      .subscribe((diaryPages: IDiaryPage[]) => (this.diaryPagesSharedCollection = diaryPages));
  }
}
