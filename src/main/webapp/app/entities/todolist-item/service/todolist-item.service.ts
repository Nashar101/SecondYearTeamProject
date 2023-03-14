import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITodolistItem, NewTodolistItem } from '../todolist-item.model';

export type PartialUpdateTodolistItem = Partial<ITodolistItem> & Pick<ITodolistItem, 'id'>;

type RestOf<T extends ITodolistItem | NewTodolistItem> = Omit<T, 'creationTime' | 'lastEditTime'> & {
  creationTime?: string | null;
  lastEditTime?: string | null;
};

export type RestTodolistItem = RestOf<ITodolistItem>;

export type NewRestTodolistItem = RestOf<NewTodolistItem>;

export type PartialUpdateRestTodolistItem = RestOf<PartialUpdateTodolistItem>;

export type EntityResponseType = HttpResponse<ITodolistItem>;
export type EntityArrayResponseType = HttpResponse<ITodolistItem[]>;

@Injectable({ providedIn: 'root' })
export class TodolistItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/todolist-items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(todolistItem: NewTodolistItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(todolistItem);
    return this.http
      .post<RestTodolistItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(todolistItem: ITodolistItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(todolistItem);
    return this.http
      .put<RestTodolistItem>(`${this.resourceUrl}/${this.getTodolistItemIdentifier(todolistItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(todolistItem: PartialUpdateTodolistItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(todolistItem);
    return this.http
      .patch<RestTodolistItem>(`${this.resourceUrl}/${this.getTodolistItemIdentifier(todolistItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTodolistItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTodolistItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTodolistItemIdentifier(todolistItem: Pick<ITodolistItem, 'id'>): number {
    return todolistItem.id as number;
  }

  compareTodolistItem(o1: Pick<ITodolistItem, 'id'> | null, o2: Pick<ITodolistItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getTodolistItemIdentifier(o1) === this.getTodolistItemIdentifier(o2) : o1 === o2;
  }

  addTodolistItemToCollectionIfMissing<Type extends Pick<ITodolistItem, 'id'>>(
    todolistItemCollection: Type[],
    ...todolistItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const todolistItems: Type[] = todolistItemsToCheck.filter(isPresent);
    if (todolistItems.length > 0) {
      const todolistItemCollectionIdentifiers = todolistItemCollection.map(
        todolistItemItem => this.getTodolistItemIdentifier(todolistItemItem)!
      );
      const todolistItemsToAdd = todolistItems.filter(todolistItemItem => {
        const todolistItemIdentifier = this.getTodolistItemIdentifier(todolistItemItem);
        if (todolistItemCollectionIdentifiers.includes(todolistItemIdentifier)) {
          return false;
        }
        todolistItemCollectionIdentifiers.push(todolistItemIdentifier);
        return true;
      });
      return [...todolistItemsToAdd, ...todolistItemCollection];
    }
    return todolistItemCollection;
  }

  protected convertDateFromClient<T extends ITodolistItem | NewTodolistItem | PartialUpdateTodolistItem>(todolistItem: T): RestOf<T> {
    return {
      ...todolistItem,
      creationTime: todolistItem.creationTime?.toJSON() ?? null,
      lastEditTime: todolistItem.lastEditTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTodolistItem: RestTodolistItem): ITodolistItem {
    return {
      ...restTodolistItem,
      creationTime: restTodolistItem.creationTime ? dayjs(restTodolistItem.creationTime) : undefined,
      lastEditTime: restTodolistItem.lastEditTime ? dayjs(restTodolistItem.lastEditTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTodolistItem>): HttpResponse<ITodolistItem> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTodolistItem[]>): HttpResponse<ITodolistItem[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
