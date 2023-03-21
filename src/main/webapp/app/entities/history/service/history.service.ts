import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistory, NewHistory } from '../history.model';

export type PartialUpdateHistory = Partial<IHistory> & Pick<IHistory, 'id'>;

export type EntityResponseType = HttpResponse<IHistory>;
export type EntityArrayResponseType = HttpResponse<IHistory[]>;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/histories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(history: NewHistory): Observable<EntityResponseType> {
    return this.http.post<IHistory>(this.resourceUrl, history, { observe: 'response' });
  }

  update(history: IHistory): Observable<EntityResponseType> {
    return this.http.put<IHistory>(`${this.resourceUrl}/${this.getHistoryIdentifier(history)}`, history, { observe: 'response' });
  }

  partialUpdate(history: PartialUpdateHistory): Observable<EntityResponseType> {
    return this.http.patch<IHistory>(`${this.resourceUrl}/${this.getHistoryIdentifier(history)}`, history, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHistory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHistoryIdentifier(history: Pick<IHistory, 'id'>): number {
    return history.id;
  }

  compareHistory(o1: Pick<IHistory, 'id'> | null, o2: Pick<IHistory, 'id'> | null): boolean {
    return o1 && o2 ? this.getHistoryIdentifier(o1) === this.getHistoryIdentifier(o2) : o1 === o2;
  }

  addHistoryToCollectionIfMissing<Type extends Pick<IHistory, 'id'>>(
    historyCollection: Type[],
    ...historiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const histories: Type[] = historiesToCheck.filter(isPresent);
    if (histories.length > 0) {
      const historyCollectionIdentifiers = historyCollection.map(historyItem => this.getHistoryIdentifier(historyItem)!);
      const historiesToAdd = histories.filter(historyItem => {
        const historyIdentifier = this.getHistoryIdentifier(historyItem);
        if (historyCollectionIdentifiers.includes(historyIdentifier)) {
          return false;
        }
        historyCollectionIdentifiers.push(historyIdentifier);
        return true;
      });
      return [...historiesToAdd, ...historyCollection];
    }
    return historyCollection;
  }
}
