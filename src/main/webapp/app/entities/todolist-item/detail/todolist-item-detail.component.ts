import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITodolistItem } from '../todolist-item.model';

@Component({
  selector: 'jhi-todolist-item-detail',
  templateUrl: './todolist-item-detail.component.html',
})
export class TodolistItemDetailComponent implements OnInit {
  todolistItem: ITodolistItem | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ todolistItem }) => {
      this.todolistItem = todolistItem;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
