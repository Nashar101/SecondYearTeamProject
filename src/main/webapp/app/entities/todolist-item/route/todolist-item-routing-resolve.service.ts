import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITodolistItem } from '../todolist-item.model';
import { TodolistItemService } from '../service/todolist-item.service';

@Injectable({ providedIn: 'root' })
export class TodolistItemRoutingResolveService implements Resolve<ITodolistItem | null> {
  constructor(protected service: TodolistItemService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITodolistItem | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((todolistItem: HttpResponse<ITodolistItem>) => {
          if (todolistItem.body) {
            return of(todolistItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
