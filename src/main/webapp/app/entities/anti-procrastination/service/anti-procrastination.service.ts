import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAntiProcrastination, NewAntiProcrastination } from '../anti-procrastination.model';

export type PartialUpdateAntiProcrastination = Partial<IAntiProcrastination> & Pick<IAntiProcrastination, 'id'>;

export type EntityResponseType = HttpResponse<IAntiProcrastination>;
export type EntityArrayResponseType = HttpResponse<IAntiProcrastination[]>;

@Injectable({ providedIn: 'root' })
export class AntiProcrastinationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/anti-procrastinations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(antiProcrastination: NewAntiProcrastination): Observable<EntityResponseType> {
    return this.http.post<IAntiProcrastination>(this.resourceUrl, antiProcrastination, { observe: 'response' });
  }

  update(antiProcrastination: IAntiProcrastination): Observable<EntityResponseType> {
    return this.http.put<IAntiProcrastination>(
      `${this.resourceUrl}/${this.getAntiProcrastinationIdentifier(antiProcrastination)}`,
      antiProcrastination,
      { observe: 'response' }
    );
  }

  partialUpdate(antiProcrastination: PartialUpdateAntiProcrastination): Observable<EntityResponseType> {
    return this.http.patch<IAntiProcrastination>(
      `${this.resourceUrl}/${this.getAntiProcrastinationIdentifier(antiProcrastination)}`,
      antiProcrastination,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAntiProcrastination>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAntiProcrastination[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAntiProcrastinationIdentifier(antiProcrastination: Pick<IAntiProcrastination, 'id'>): number {
    return antiProcrastination.id;
  }

  compareAntiProcrastination(o1: Pick<IAntiProcrastination, 'id'> | null, o2: Pick<IAntiProcrastination, 'id'> | null): boolean {
    return o1 && o2 ? this.getAntiProcrastinationIdentifier(o1) === this.getAntiProcrastinationIdentifier(o2) : o1 === o2;
  }

  addAntiProcrastinationToCollectionIfMissing<Type extends Pick<IAntiProcrastination, 'id'>>(
    antiProcrastinationCollection: Type[],
    ...antiProcrastinationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const antiProcrastinations: Type[] = antiProcrastinationsToCheck.filter(isPresent);
    if (antiProcrastinations.length > 0) {
      const antiProcrastinationCollectionIdentifiers = antiProcrastinationCollection.map(
        antiProcrastinationItem => this.getAntiProcrastinationIdentifier(antiProcrastinationItem)!
      );
      const antiProcrastinationsToAdd = antiProcrastinations.filter(antiProcrastinationItem => {
        const antiProcrastinationIdentifier = this.getAntiProcrastinationIdentifier(antiProcrastinationItem);
        if (antiProcrastinationCollectionIdentifiers.includes(antiProcrastinationIdentifier)) {
          return false;
        }
        antiProcrastinationCollectionIdentifiers.push(antiProcrastinationIdentifier);
        return true;
      });
      return [...antiProcrastinationsToAdd, ...antiProcrastinationCollection];
    }
    return antiProcrastinationCollection;
  }
}
