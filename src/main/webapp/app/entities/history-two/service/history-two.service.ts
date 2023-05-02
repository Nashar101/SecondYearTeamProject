import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistoryTwo, NewHistoryTwo } from '../history-two.model';

export type PartialUpdateHistoryTwo = Partial<IHistoryTwo> & Pick<IHistoryTwo, 'id'>;

export type EntityResponseType = HttpResponse<IHistoryTwo>;
export type EntityArrayResponseType = HttpResponse<IHistoryTwo[]>;

@Injectable({ providedIn: 'root' })
export class HistoryTwoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/history-twos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(historyTwo: NewHistoryTwo): Observable<EntityResponseType> {
    return this.http.post<IHistoryTwo>(this.resourceUrl, historyTwo, { observe: 'response' });
  }

  update(historyTwo: IHistoryTwo): Observable<EntityResponseType> {
    return this.http.put<IHistoryTwo>(`${this.resourceUrl}/${this.getHistoryTwoIdentifier(historyTwo)}`, historyTwo, {
      observe: 'response',
    });
  }

  partialUpdate(historyTwo: PartialUpdateHistoryTwo): Observable<EntityResponseType> {
    return this.http.patch<IHistoryTwo>(`${this.resourceUrl}/${this.getHistoryTwoIdentifier(historyTwo)}`, historyTwo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHistoryTwo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHistoryTwo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHistoryTwoIdentifier(historyTwo: Pick<IHistoryTwo, 'id'>): number {
    return historyTwo.id;
  }

  compareHistoryTwo(o1: Pick<IHistoryTwo, 'id'> | null, o2: Pick<IHistoryTwo, 'id'> | null): boolean {
    return o1 && o2 ? this.getHistoryTwoIdentifier(o1) === this.getHistoryTwoIdentifier(o2) : o1 === o2;
  }

  addHistoryTwoToCollectionIfMissing<Type extends Pick<IHistoryTwo, 'id'>>(
    historyTwoCollection: Type[],
    ...historyTwosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const historyTwos: Type[] = historyTwosToCheck.filter(isPresent);
    if (historyTwos.length > 0) {
      const historyTwoCollectionIdentifiers = historyTwoCollection.map(historyTwoItem => this.getHistoryTwoIdentifier(historyTwoItem)!);
      const historyTwosToAdd = historyTwos.filter(historyTwoItem => {
        const historyTwoIdentifier = this.getHistoryTwoIdentifier(historyTwoItem);
        if (historyTwoCollectionIdentifiers.includes(historyTwoIdentifier)) {
          return false;
        }
        historyTwoCollectionIdentifiers.push(historyTwoIdentifier);
        return true;
      });
      return [...historyTwosToAdd, ...historyTwoCollection];
    }
    return historyTwoCollection;
  }
}
