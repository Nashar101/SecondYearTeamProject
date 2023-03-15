import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TodolistItemFormService, TodolistItemFormGroup } from './todolist-item-form.service';
import { ITodolistItem } from '../todolist-item.model';
import { TodolistItemService } from '../service/todolist-item.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-todolist-item-update',
  templateUrl: './todolist-item-update.component.html',
})
export class TodolistItemUpdateComponent implements OnInit {
  isSaving = false;
  todolistItem: ITodolistItem | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: TodolistItemFormGroup = this.todolistItemFormService.createTodolistItemFormGroup();

  constructor(
    protected todolistItemService: TodolistItemService,
    protected todolistItemFormService: TodolistItemFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todolistItem }) => {
      this.todolistItem = todolistItem;
      if (todolistItem) {
        this.updateForm(todolistItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const todolistItem = this.todolistItemFormService.getTodolistItem(this.editForm);
    if (todolistItem.id !== null) {
      this.subscribeToSaveResponse(this.todolistItemService.update(todolistItem));
    } else {
      this.subscribeToSaveResponse(this.todolistItemService.create(todolistItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITodolistItem>>): void {
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

  protected updateForm(todolistItem: ITodolistItem): void {
    this.todolistItem = todolistItem;
    this.todolistItemFormService.resetForm(this.editForm, todolistItem);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, todolistItem.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.todolistItem?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
