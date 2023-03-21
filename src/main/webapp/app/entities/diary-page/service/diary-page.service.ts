import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiaryPage, NewDiaryPage } from '../diary-page.model';

export type PartialUpdateDiaryPage = Partial<IDiaryPage> & Pick<IDiaryPage, 'id'>;

type RestOf<T extends IDiaryPage | NewDiaryPage> = Omit<T, 'pageDate' | 'creationTime' | 'lastEditTime'> & {
  pageDate?: string | null;
  creationTime?: string | null;
  lastEditTime?: string | null;
};

export type RestDiaryPage = RestOf<IDiaryPage>;

export type NewRestDiaryPage = RestOf<NewDiaryPage>;

export type PartialUpdateRestDiaryPage = RestOf<PartialUpdateDiaryPage>;

export type EntityResponseType = HttpResponse<IDiaryPage>;
export type EntityArrayResponseType = HttpResponse<IDiaryPage[]>;

@Injectable({ providedIn: 'root' })
export class DiaryPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/diary-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(diaryPage: NewDiaryPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diaryPage);
    return this.http
      .post<RestDiaryPage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(diaryPage: IDiaryPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diaryPage);
    return this.http
      .put<RestDiaryPage>(`${this.resourceUrl}/${this.getDiaryPageIdentifier(diaryPage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(diaryPage: PartialUpdateDiaryPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diaryPage);
    return this.http
      .patch<RestDiaryPage>(`${this.resourceUrl}/${this.getDiaryPageIdentifier(diaryPage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDiaryPage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDiaryPage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDiaryPageIdentifier(diaryPage: Pick<IDiaryPage, 'id'>): number {
    return diaryPage.id;
  }

  compareDiaryPage(o1: Pick<IDiaryPage, 'id'> | null, o2: Pick<IDiaryPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getDiaryPageIdentifier(o1) === this.getDiaryPageIdentifier(o2) : o1 === o2;
  }

  addDiaryPageToCollectionIfMissing<Type extends Pick<IDiaryPage, 'id'>>(
    diaryPageCollection: Type[],
    ...diaryPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const diaryPages: Type[] = diaryPagesToCheck.filter(isPresent);
    if (diaryPages.length > 0) {
      const diaryPageCollectionIdentifiers = diaryPageCollection.map(diaryPageItem => this.getDiaryPageIdentifier(diaryPageItem)!);
      const diaryPagesToAdd = diaryPages.filter(diaryPageItem => {
        const diaryPageIdentifier = this.getDiaryPageIdentifier(diaryPageItem);
        if (diaryPageCollectionIdentifiers.includes(diaryPageIdentifier)) {
          return false;
        }
        diaryPageCollectionIdentifiers.push(diaryPageIdentifier);
        return true;
      });
      return [...diaryPagesToAdd, ...diaryPageCollection];
    }
    return diaryPageCollection;
  }

  protected convertDateFromClient<T extends IDiaryPage | NewDiaryPage | PartialUpdateDiaryPage>(diaryPage: T): RestOf<T> {
    return {
      ...diaryPage,
      pageDate: diaryPage.pageDate?.toJSON() ?? null,
      creationTime: diaryPage.creationTime?.toJSON() ?? null,
      lastEditTime: diaryPage.lastEditTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDiaryPage: RestDiaryPage): IDiaryPage {
    return {
      ...restDiaryPage,
      pageDate: restDiaryPage.pageDate ? dayjs(restDiaryPage.pageDate) : undefined,
      creationTime: restDiaryPage.creationTime ? dayjs(restDiaryPage.creationTime) : undefined,
      lastEditTime: restDiaryPage.lastEditTime ? dayjs(restDiaryPage.lastEditTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDiaryPage>): HttpResponse<IDiaryPage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDiaryPage[]>): HttpResponse<IDiaryPage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
