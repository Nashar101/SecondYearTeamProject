import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAlarm, NewAlarm } from '../alarm.model';

export type PartialUpdateAlarm = Partial<IAlarm> & Pick<IAlarm, 'id'>;

export type EntityResponseType = HttpResponse<IAlarm>;
export type EntityArrayResponseType = HttpResponse<IAlarm[]>;

@Injectable({ providedIn: 'root' })
export class AlarmService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/alarms');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(alarm: NewAlarm): Observable<EntityResponseType> {
    return this.http.post<IAlarm>(this.resourceUrl, alarm, { observe: 'response' });
  }

  update(alarm: IAlarm): Observable<EntityResponseType> {
    return this.http.put<IAlarm>(`${this.resourceUrl}/${this.getAlarmIdentifier(alarm)}`, alarm, { observe: 'response' });
  }

  partialUpdate(alarm: PartialUpdateAlarm): Observable<EntityResponseType> {
    return this.http.patch<IAlarm>(`${this.resourceUrl}/${this.getAlarmIdentifier(alarm)}`, alarm, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAlarm>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAlarm[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAlarmIdentifier(alarm: Pick<IAlarm, 'id'>): number {
    return alarm.id;
  }

  compareAlarm(o1: Pick<IAlarm, 'id'> | null, o2: Pick<IAlarm, 'id'> | null): boolean {
    return o1 && o2 ? this.getAlarmIdentifier(o1) === this.getAlarmIdentifier(o2) : o1 === o2;
  }

  addAlarmToCollectionIfMissing<Type extends Pick<IAlarm, 'id'>>(
    alarmCollection: Type[],
    ...alarmsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const alarms: Type[] = alarmsToCheck.filter(isPresent);
    if (alarms.length > 0) {
      const alarmCollectionIdentifiers = alarmCollection.map(alarmItem => this.getAlarmIdentifier(alarmItem)!);
      const alarmsToAdd = alarms.filter(alarmItem => {
        const alarmIdentifier = this.getAlarmIdentifier(alarmItem);
        if (alarmCollectionIdentifiers.includes(alarmIdentifier)) {
          return false;
        }
        alarmCollectionIdentifiers.push(alarmIdentifier);
        return true;
      });
      return [...alarmsToAdd, ...alarmCollection];
    }
    return alarmCollection;
  }
}
