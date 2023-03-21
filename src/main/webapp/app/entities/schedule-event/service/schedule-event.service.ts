import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IScheduleEvent, NewScheduleEvent } from '../schedule-event.model';

export type PartialUpdateScheduleEvent = Partial<IScheduleEvent> & Pick<IScheduleEvent, 'id'>;

type RestOf<T extends IScheduleEvent | NewScheduleEvent> = Omit<T, 'startTime' | 'endTime' | 'date'> & {
  startTime?: string | null;
  endTime?: string | null;
  date?: string | null;
};

export type RestScheduleEvent = RestOf<IScheduleEvent>;

export type NewRestScheduleEvent = RestOf<NewScheduleEvent>;

export type PartialUpdateRestScheduleEvent = RestOf<PartialUpdateScheduleEvent>;

export type EntityResponseType = HttpResponse<IScheduleEvent>;
export type EntityArrayResponseType = HttpResponse<IScheduleEvent[]>;

@Injectable({ providedIn: 'root' })
export class ScheduleEventService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/schedule-events');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(scheduleEvent: NewScheduleEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(scheduleEvent);
    return this.http
      .post<RestScheduleEvent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(scheduleEvent: IScheduleEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(scheduleEvent);
    return this.http
      .put<RestScheduleEvent>(`${this.resourceUrl}/${this.getScheduleEventIdentifier(scheduleEvent)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(scheduleEvent: PartialUpdateScheduleEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(scheduleEvent);
    return this.http
      .patch<RestScheduleEvent>(`${this.resourceUrl}/${this.getScheduleEventIdentifier(scheduleEvent)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestScheduleEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestScheduleEvent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getScheduleEventIdentifier(scheduleEvent: Pick<IScheduleEvent, 'id'>): number {
    return scheduleEvent.id;
  }

  compareScheduleEvent(o1: Pick<IScheduleEvent, 'id'> | null, o2: Pick<IScheduleEvent, 'id'> | null): boolean {
    return o1 && o2 ? this.getScheduleEventIdentifier(o1) === this.getScheduleEventIdentifier(o2) : o1 === o2;
  }

  addScheduleEventToCollectionIfMissing<Type extends Pick<IScheduleEvent, 'id'>>(
    scheduleEventCollection: Type[],
    ...scheduleEventsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const scheduleEvents: Type[] = scheduleEventsToCheck.filter(isPresent);
    if (scheduleEvents.length > 0) {
      const scheduleEventCollectionIdentifiers = scheduleEventCollection.map(
        scheduleEventItem => this.getScheduleEventIdentifier(scheduleEventItem)!
      );
      const scheduleEventsToAdd = scheduleEvents.filter(scheduleEventItem => {
        const scheduleEventIdentifier = this.getScheduleEventIdentifier(scheduleEventItem);
        if (scheduleEventCollectionIdentifiers.includes(scheduleEventIdentifier)) {
          return false;
        }
        scheduleEventCollectionIdentifiers.push(scheduleEventIdentifier);
        return true;
      });
      return [...scheduleEventsToAdd, ...scheduleEventCollection];
    }
    return scheduleEventCollection;
  }

  protected convertDateFromClient<T extends IScheduleEvent | NewScheduleEvent | PartialUpdateScheduleEvent>(scheduleEvent: T): RestOf<T> {
    return {
      ...scheduleEvent,
      startTime: scheduleEvent.startTime?.toJSON() ?? null,
      endTime: scheduleEvent.endTime?.toJSON() ?? null,
      date: scheduleEvent.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restScheduleEvent: RestScheduleEvent): IScheduleEvent {
    return {
      ...restScheduleEvent,
      startTime: restScheduleEvent.startTime ? dayjs(restScheduleEvent.startTime) : undefined,
      endTime: restScheduleEvent.endTime ? dayjs(restScheduleEvent.endTime) : undefined,
      date: restScheduleEvent.date ? dayjs(restScheduleEvent.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestScheduleEvent>): HttpResponse<IScheduleEvent> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestScheduleEvent[]>): HttpResponse<IScheduleEvent[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
