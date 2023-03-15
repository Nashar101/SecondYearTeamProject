import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITodolistItem } from '../todolist-item.model';
import { TodolistItemService } from '../service/todolist-item.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './todolist-item-delete-dialog.component.html',
})
export class TodolistItemDeleteDialogComponent {
  todolistItem?: ITodolistItem;

  constructor(protected todolistItemService: TodolistItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.todolistItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
