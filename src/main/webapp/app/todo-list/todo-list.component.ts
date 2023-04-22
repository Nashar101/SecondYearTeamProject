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

  loadAll(): void {
    this.todolistItemService.query().subscribe(response => {
      const items = response.body || [];
      this.todoItems = items.filter(item => !item.completed);
      this.doneItems = items.filter(item => item.completed);
    });
  }

  moveItem(event: MouseEvent, item: ITodolistItem): void {
    item.completed = !item.completed;
    this.todolistItemService.update(item).subscribe(() => {
      this.loadAll();
    });
  }

  selectedItem: ITodolistItem | null = null;
  originalItem: ITodolistItem | null = null;

  showDetails(item: ITodolistItem): void {
    this.selectedItem = item;
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
        this.originalItem = null;
        this.selectedItem = null;
      });
    }
  }

  cancelChanges(): void {
    this.originalItem = null;
    this.selectedItem = null;
    this.loadAll();
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
      });
    }
  }

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
      }, 100);
    } else {
      (document.querySelector('.todo-items') as HTMLElement).classList.remove('half-width');
      (document.querySelector('.done-items') as HTMLElement).classList.remove('half-width');
    }
  }

  ngOnInit(): void {
    this.loadAll();
  }
}
