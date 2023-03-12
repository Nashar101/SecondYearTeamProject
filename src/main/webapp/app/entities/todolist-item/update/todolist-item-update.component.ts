import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TodolistItemFormService, TodolistItemFormGroup } from './todolist-item-form.service';
import { ITodolistItem } from '../todolist-item.model';
import { TodolistItemService } from '../service/todolist-item.service';

@Component({
  selector: 'jhi-todolist-item-update',
  templateUrl: './todolist-item-update.component.html',
})
export class TodolistItemUpdateComponent implements OnInit {
  isSaving = false;
  todolistItem: ITodolistItem | null = null;

  editForm: TodolistItemFormGroup = this.todolistItemFormService.createTodolistItemFormGroup();

  constructor(
    protected todolistItemService: TodolistItemService,
    protected todolistItemFormService: TodolistItemFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todolistItem }) => {
      this.todolistItem = todolistItem;
      if (todolistItem) {
        this.updateForm(todolistItem);
      }
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
  }
}
