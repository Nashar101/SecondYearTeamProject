import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    this.originalItem = { ...item };
    this.selectedItem = item;
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
      if (this.selectedItem.id === -1) {
        this.todolistItemService.create(this.selectedItem).subscribe(() => {
          this.loadAll();
        });
      } else {
        this.selectedItem.lastEditTime = dayjs() as any;
        this.todolistItemService.update(this.selectedItem).subscribe(() => {
          this.loadAll();
        });
      }
      this.originalItem = null;
      this.selectedItem = null;
    }
  }

  cancelChanges(): void {
    this.originalItem = null;
    this.selectedItem = null;
  }

  createNewItem(): void {
    this.originalItem = null;
    this.selectedItem = null;
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.userService.find(account.login).subscribe(userResponse => {
          const user = userResponse.body;
          if (user) {
            const newItem: ITodolistItem = {
              id: -1,
              heading: 'New Heading!',
              description: 'Nothing here',
              creationTime: dayjs() as any,
              lastEditTime: dayjs() as any,
              completed: false,
              user: { id: user.id, login: user.login },
            };
            this.todoItems.push(newItem);
            this.showDetails(newItem);
            this.changeDetectorRef.detectChanges();
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }
}
