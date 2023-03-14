import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITesting, NewTesting } from '../testing.model';

export type PartialUpdateTesting = Partial<ITesting> & Pick<ITesting, 'id'>;

export type EntityResponseType = HttpResponse<ITesting>;
export type EntityArrayResponseType = HttpResponse<ITesting[]>;

@Injectable({ providedIn: 'root' })
export class TestingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/testings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(testing: NewTesting): Observable<EntityResponseType> {
    return this.http.post<ITesting>(this.resourceUrl, testing, { observe: 'response' });
  }

  update(testing: ITesting): Observable<EntityResponseType> {
    return this.http.put<ITesting>(`${this.resourceUrl}/${this.getTestingIdentifier(testing)}`, testing, { observe: 'response' });
  }

  partialUpdate(testing: PartialUpdateTesting): Observable<EntityResponseType> {
    return this.http.patch<ITesting>(`${this.resourceUrl}/${this.getTestingIdentifier(testing)}`, testing, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITesting>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITesting[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTestingIdentifier(testing: Pick<ITesting, 'id'>): number {
    return testing.id;
  }

  compareTesting(o1: Pick<ITesting, 'id'> | null, o2: Pick<ITesting, 'id'> | null): boolean {
    return o1 && o2 ? this.getTestingIdentifier(o1) === this.getTestingIdentifier(o2) : o1 === o2;
  }

  addTestingToCollectionIfMissing<Type extends Pick<ITesting, 'id'>>(
    testingCollection: Type[],
    ...testingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const testings: Type[] = testingsToCheck.filter(isPresent);
    if (testings.length > 0) {
      const testingCollectionIdentifiers = testingCollection.map(testingItem => this.getTestingIdentifier(testingItem)!);
      const testingsToAdd = testings.filter(testingItem => {
        const testingIdentifier = this.getTestingIdentifier(testingItem);
        if (testingCollectionIdentifiers.includes(testingIdentifier)) {
          return false;
        }
        testingCollectionIdentifiers.push(testingIdentifier);
        return true;
      });
      return [...testingsToAdd, ...testingCollection];
    }
    return testingCollection;
  }
}
