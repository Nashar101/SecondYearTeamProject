import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAntiprocrastinationListTwo, NewAntiprocrastinationListTwo } from '../antiprocrastination-list-two.model';

export type PartialUpdateAntiprocrastinationListTwo = Partial<IAntiprocrastinationListTwo> & Pick<IAntiprocrastinationListTwo, 'id'>;

type RestOf<T extends IAntiprocrastinationListTwo | NewAntiprocrastinationListTwo> = Omit<T, 'dueDate'> & {
  dueDate?: string | null;
};

export type RestAntiprocrastinationListTwo = RestOf<IAntiprocrastinationListTwo>;

export type NewRestAntiprocrastinationListTwo = RestOf<NewAntiprocrastinationListTwo>;

export type PartialUpdateRestAntiprocrastinationListTwo = RestOf<PartialUpdateAntiprocrastinationListTwo>;

export type EntityResponseType = HttpResponse<IAntiprocrastinationListTwo>;
export type EntityArrayResponseType = HttpResponse<IAntiprocrastinationListTwo[]>;

@Injectable({ providedIn: 'root' })
export class AntiprocrastinationListTwoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/antiprocrastination-list-twos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(antiprocrastinationListTwo: NewAntiprocrastinationListTwo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(antiprocrastinationListTwo);
    return this.http
      .post<RestAntiprocrastinationListTwo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(antiprocrastinationListTwo: IAntiprocrastinationListTwo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(antiprocrastinationListTwo);
    return this.http
      .put<RestAntiprocrastinationListTwo>(
        `${this.resourceUrl}/${this.getAntiprocrastinationListTwoIdentifier(antiprocrastinationListTwo)}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(antiprocrastinationListTwo: PartialUpdateAntiprocrastinationListTwo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(antiprocrastinationListTwo);
    return this.http
      .patch<RestAntiprocrastinationListTwo>(
        `${this.resourceUrl}/${this.getAntiprocrastinationListTwoIdentifier(antiprocrastinationListTwo)}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAntiprocrastinationListTwo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAntiprocrastinationListTwo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAntiprocrastinationListTwoIdentifier(antiprocrastinationListTwo: Pick<IAntiprocrastinationListTwo, 'id'>): number {
    return antiprocrastinationListTwo.id;
  }

  compareAntiprocrastinationListTwo(
    o1: Pick<IAntiprocrastinationListTwo, 'id'> | null,
    o2: Pick<IAntiprocrastinationListTwo, 'id'> | null
  ): boolean {
    return o1 && o2 ? this.getAntiprocrastinationListTwoIdentifier(o1) === this.getAntiprocrastinationListTwoIdentifier(o2) : o1 === o2;
  }

  addAntiprocrastinationListTwoToCollectionIfMissing<Type extends Pick<IAntiprocrastinationListTwo, 'id'>>(
    antiprocrastinationListTwoCollection: Type[],
    ...antiprocrastinationListTwosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const antiprocrastinationListTwos: Type[] = antiprocrastinationListTwosToCheck.filter(isPresent);
    if (antiprocrastinationListTwos.length > 0) {
      const antiprocrastinationListTwoCollectionIdentifiers = antiprocrastinationListTwoCollection.map(
        antiprocrastinationListTwoItem => this.getAntiprocrastinationListTwoIdentifier(antiprocrastinationListTwoItem)!
      );
      const antiprocrastinationListTwosToAdd = antiprocrastinationListTwos.filter(antiprocrastinationListTwoItem => {
        const antiprocrastinationListTwoIdentifier = this.getAntiprocrastinationListTwoIdentifier(antiprocrastinationListTwoItem);
        if (antiprocrastinationListTwoCollectionIdentifiers.includes(antiprocrastinationListTwoIdentifier)) {
          return false;
        }
        antiprocrastinationListTwoCollectionIdentifiers.push(antiprocrastinationListTwoIdentifier);
        return true;
      });
      return [...antiprocrastinationListTwosToAdd, ...antiprocrastinationListTwoCollection];
    }
    return antiprocrastinationListTwoCollection;
  }

  protected convertDateFromClient<
    T extends IAntiprocrastinationListTwo | NewAntiprocrastinationListTwo | PartialUpdateAntiprocrastinationListTwo
  >(antiprocrastinationListTwo: T): RestOf<T> {
    return {
      ...antiprocrastinationListTwo,
      dueDate: antiprocrastinationListTwo.dueDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAntiprocrastinationListTwo: RestAntiprocrastinationListTwo): IAntiprocrastinationListTwo {
    return {
      ...restAntiprocrastinationListTwo,
      dueDate: restAntiprocrastinationListTwo.dueDate ? dayjs(restAntiprocrastinationListTwo.dueDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAntiprocrastinationListTwo>): HttpResponse<IAntiprocrastinationListTwo> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(
    res: HttpResponse<RestAntiprocrastinationListTwo[]>
  ): HttpResponse<IAntiprocrastinationListTwo[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
