import { Component, OnInit, ChangeDetectorRef, HostBinding } from '@angular/core';
import { ITodolistItem } from '../entities/todolist-item/todolist-item.model';
import { AccountService } from 'app/core/auth/account.service';
import { UserService } from 'app/entities/user/user.service';
import { TodolistItemService } from '../entities/todolist-item/service/todolist-item.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  todoItems: ITodolistItem[] = [];
  doneItems: ITodolistItem[] = [];

  constructor(
    private todolistItemService: TodolistItemService,
    private userService: UserService,
    private accountService: AccountService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  selectedItem: ITodolistItem | null = null;
  originalItem: ITodolistItem | null = null;

  closeDetailWindow(): void {
    this.selectedItem = null;
    if (this.detailsVisible) {
      this.toggleDetails();
    }
  }

  detailsVisible = false;

  toggleDetails() {
    this.detailsVisible = !this.detailsVisible;

    if (this.detailsVisible) {
      setTimeout(() => {
        (document.querySelector('.todo-items') as HTMLElement).classList.add('half-width');
        (document.querySelector('.done-items') as HTMLElement).classList.add('half-width');
        (document.querySelector('.Detail-Window') as HTMLElement).classList.add('not-hidden');
      }, 100);
    } else {
      (document.querySelector('.todo-items') as HTMLElement).classList.remove('half-width');
      (document.querySelector('.done-items') as HTMLElement).classList.remove('half-width');
      (document.querySelector('.Detail-Window') as HTMLElement).classList.remove('not-hidden');
    }
  }

  showDetails(item: ITodolistItem): void {
    this.selectedItem = item;
    this.originalItem = { ...item };
    if (!this.detailsVisible) {
      this.toggleDetails();
    }
  }

  updateHeading(heading: string) {
    if (this.selectedItem) {
      this.selectedItem.heading = heading;
    }
  }

  updateDescription(description: string) {
    if (this.selectedItem) {
      this.selectedItem.description = description;
    }
  }

  saveChanges(): void {
    if (this.selectedItem && this.originalItem) {
      this.selectedItem.lastEditTime = dayjs() as any;
      this.todolistItemService.update(this.selectedItem).subscribe(() => {
        this.loadAll();
        this.closeDetailWindow();
        this.originalItem = null;
        this.selectedItem = null;
      });
    }
  }

  cancelChanges(): void {
    this.originalItem = null;
    this.selectedItem = null;
    this.loadAll();
    this.closeDetailWindow();
  }

  moveItem(event: MouseEvent, item: ITodolistItem): void {
    item.completed = !item.completed;
    this.todolistItemService.update(item).subscribe(() => {
      this.moveItemLocally(item);
    });
    if (this.selectedItem) {
      const selectedItem = this.todoItems.concat(this.doneItems).find(item => item.id === this.selectedItem!.id);
      if (selectedItem) {
        this.selectedItem = selectedItem;
      } else {
        this.selectedItem = null;
      }
    }
  }

  moveItemLocally(item: ITodolistItem): void {
    if (item.completed) {
      this.todoItems = this.todoItems.filter(todoItem => todoItem.id !== item.id);
      this.doneItems.push(item);
    } else {
      this.doneItems = this.doneItems.filter(doneItem => doneItem.id !== item.id);
      this.todoItems.push(item);
    }
  }

  createNewItem(): void {
    const newItem: ITodolistItem = {
      id: null,
      heading: 'New Heading!',
      description: 'Nothing here',
      creationTime: dayjs() as any,
      lastEditTime: dayjs() as any,
      completed: false,
    };
    this.todolistItemService.create(newItem).subscribe(() => {
      this.loadAll();
      setTimeout(() => {
        this.showDetails(this.todoItems[this.todoItems.length - 1]);
      }, 100);
    });
  }

  deleteItem(): void {
    if (this.selectedItem) {
      this.todolistItemService.delete(this.selectedItem.id!).subscribe(() => {
        this.loadAll();
        this.selectedItem = null;
        this.originalItem = null;
        this.closeDetailWindow();
      });
    }
  }

  loadAll(): void {
    this.todolistItemService.query().subscribe(response => {
      const items = response.body || [];
      this.todoItems = items.filter(item => !item.completed);
      this.doneItems = items.filter(item => item.completed);
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }
}
