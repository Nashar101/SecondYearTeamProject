import dayjs from 'dayjs/esm';

import { IScheduleEvent, NewScheduleEvent } from './schedule-event.model';

export const sampleWithRequiredData: IScheduleEvent = {
  id: 36238,
};

export const sampleWithPartialData: IScheduleEvent = {
  id: 5739,
  heading: 'Rubber Tanzanian XSS',
  details: 'Grocery Roads',
};

export const sampleWithFullData: IScheduleEvent = {
  id: 34375,
  startTime: dayjs('2023-03-20T19:57'),
  endTime: dayjs('2023-03-20T18:30'),
  heading: 'mobile',
  date: dayjs('2023-03-21T07:08'),
  details: 'envisioneer transmitting',
};

export const sampleWithNewData: NewScheduleEvent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
