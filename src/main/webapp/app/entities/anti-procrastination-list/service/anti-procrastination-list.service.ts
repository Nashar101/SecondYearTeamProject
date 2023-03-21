import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAntiProcrastinationList, NewAntiProcrastinationList } from '../anti-procrastination-list.model';

export type PartialUpdateAntiProcrastinationList = Partial<IAntiProcrastinationList> & Pick<IAntiProcrastinationList, 'id'>;

type RestOf<T extends IAntiProcrastinationList | NewAntiProcrastinationList> = Omit<T, 'dueDate'> & {
  dueDate?: string | null;
};

export type RestAntiProcrastinationList = RestOf<IAntiProcrastinationList>;

export type NewRestAntiProcrastinationList = RestOf<NewAntiProcrastinationList>;

export type PartialUpdateRestAntiProcrastinationList = RestOf<PartialUpdateAntiProcrastinationList>;

export type EntityResponseType = HttpResponse<IAntiProcrastinationList>;
export type EntityArrayResponseType = HttpResponse<IAntiProcrastinationList[]>;

@Injectable({ providedIn: 'root' })
export class AntiProcrastinationListService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/anti-procrastination-lists');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(antiProcrastinationList: NewAntiProcrastinationList): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(antiProcrastinationList);
    return this.http
      .post<RestAntiProcrastinationList>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(antiProcrastinationList: IAntiProcrastinationList): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(antiProcrastinationList);
    return this.http
      .put<RestAntiProcrastinationList>(`${this.resourceUrl}/${this.getAntiProcrastinationListIdentifier(antiProcrastinationList)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(antiProcrastinationList: PartialUpdateAntiProcrastinationList): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(antiProcrastinationList);
    return this.http
      .patch<RestAntiProcrastinationList>(
        `${this.resourceUrl}/${this.getAntiProcrastinationListIdentifier(antiProcrastinationList)}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAntiProcrastinationList>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAntiProcrastinationList[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAntiProcrastinationListIdentifier(antiProcrastinationList: Pick<IAntiProcrastinationList, 'id'>): number {
    return antiProcrastinationList.id;
  }

  compareAntiProcrastinationList(
    o1: Pick<IAntiProcrastinationList, 'id'> | null,
    o2: Pick<IAntiProcrastinationList, 'id'> | null
  ): boolean {
    return o1 && o2 ? this.getAntiProcrastinationListIdentifier(o1) === this.getAntiProcrastinationListIdentifier(o2) : o1 === o2;
  }

  addAntiProcrastinationListToCollectionIfMissing<Type extends Pick<IAntiProcrastinationList, 'id'>>(
    antiProcrastinationListCollection: Type[],
    ...antiProcrastinationListsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const antiProcrastinationLists: Type[] = antiProcrastinationListsToCheck.filter(isPresent);
    if (antiProcrastinationLists.length > 0) {
      const antiProcrastinationListCollectionIdentifiers = antiProcrastinationListCollection.map(
        antiProcrastinationListItem => this.getAntiProcrastinationListIdentifier(antiProcrastinationListItem)!
      );
      const antiProcrastinationListsToAdd = antiProcrastinationLists.filter(antiProcrastinationListItem => {
        const antiProcrastinationListIdentifier = this.getAntiProcrastinationListIdentifier(antiProcrastinationListItem);
        if (antiProcrastinationListCollectionIdentifiers.includes(antiProcrastinationListIdentifier)) {
          return false;
        }
        antiProcrastinationListCollectionIdentifiers.push(antiProcrastinationListIdentifier);
        return true;
      });
      return [...antiProcrastinationListsToAdd, ...antiProcrastinationListCollection];
    }
    return antiProcrastinationListCollection;
  }

  protected convertDateFromClient<T extends IAntiProcrastinationList | NewAntiProcrastinationList | PartialUpdateAntiProcrastinationList>(
    antiProcrastinationList: T
  ): RestOf<T> {
    return {
      ...antiProcrastinationList,
      dueDate: antiProcrastinationList.dueDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAntiProcrastinationList: RestAntiProcrastinationList): IAntiProcrastinationList {
    return {
      ...restAntiProcrastinationList,
      dueDate: restAntiProcrastinationList.dueDate ? dayjs(restAntiProcrastinationList.dueDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAntiProcrastinationList>): HttpResponse<IAntiProcrastinationList> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAntiProcrastinationList[]>): HttpResponse<IAntiProcrastinationList[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
