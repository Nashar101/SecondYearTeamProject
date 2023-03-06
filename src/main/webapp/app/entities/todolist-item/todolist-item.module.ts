import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TodolistItemComponent } from './list/todolist-item.component';
import { TodolistItemDetailComponent } from './detail/todolist-item-detail.component';
import { TodolistItemUpdateComponent } from './update/todolist-item-update.component';
import { TodolistItemDeleteDialogComponent } from './delete/todolist-item-delete-dialog.component';
import { TodolistItemRoutingModule } from './route/todolist-item-routing.module';

@NgModule({
  imports: [SharedModule, TodolistItemRoutingModule],
  declarations: [TodolistItemComponent, TodolistItemDetailComponent, TodolistItemUpdateComponent, TodolistItemDeleteDialogComponent],
})
export class TodolistItemModule {}
