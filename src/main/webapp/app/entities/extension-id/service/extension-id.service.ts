import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExtensionID, NewExtensionID } from '../extension-id.model';

export type PartialUpdateExtensionID = Partial<IExtensionID> & Pick<IExtensionID, 'id'>;

export type EntityResponseType = HttpResponse<IExtensionID>;
export type EntityArrayResponseType = HttpResponse<IExtensionID[]>;

@Injectable({ providedIn: 'root' })
export class ExtensionIDService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/extension-ids');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(extensionID: NewExtensionID): Observable<EntityResponseType> {
    return this.http.post<IExtensionID>(this.resourceUrl, extensionID, { observe: 'response' });
  }

  update(extensionID: IExtensionID): Observable<EntityResponseType> {
    return this.http.put<IExtensionID>(`${this.resourceUrl}/${this.getExtensionIDIdentifier(extensionID)}`, extensionID, {
      observe: 'response',
    });
  }

  partialUpdate(extensionID: PartialUpdateExtensionID): Observable<EntityResponseType> {
    return this.http.patch<IExtensionID>(`${this.resourceUrl}/${this.getExtensionIDIdentifier(extensionID)}`, extensionID, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExtensionID>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExtensionID[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExtensionIDIdentifier(extensionID: Pick<IExtensionID, 'id'>): number {
    return extensionID.id;
  }

  compareExtensionID(o1: Pick<IExtensionID, 'id'> | null, o2: Pick<IExtensionID, 'id'> | null): boolean {
    return o1 && o2 ? this.getExtensionIDIdentifier(o1) === this.getExtensionIDIdentifier(o2) : o1 === o2;
  }

  addExtensionIDToCollectionIfMissing<Type extends Pick<IExtensionID, 'id'>>(
    extensionIDCollection: Type[],
    ...extensionIDSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const extensionIDS: Type[] = extensionIDSToCheck.filter(isPresent);
    if (extensionIDS.length > 0) {
      const extensionIDCollectionIdentifiers = extensionIDCollection.map(
        extensionIDItem => this.getExtensionIDIdentifier(extensionIDItem)!
      );
      const extensionIDSToAdd = extensionIDS.filter(extensionIDItem => {
        const extensionIDIdentifier = this.getExtensionIDIdentifier(extensionIDItem);
        if (extensionIDCollectionIdentifiers.includes(extensionIDIdentifier)) {
          return false;
        }
        extensionIDCollectionIdentifiers.push(extensionIDIdentifier);
        return true;
      });
      return [...extensionIDSToAdd, ...extensionIDCollection];
    }
    return extensionIDCollection;
  }
}
