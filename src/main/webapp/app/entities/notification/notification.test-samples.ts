import dayjs from 'dayjs/esm';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 30621,
};

export const sampleWithPartialData: INotification = {
  id: 25492,
  content: 'Brooks',
  receivedDate: dayjs('2023-03-22T07:33'),
  status: true,
  read: false,
};

export const sampleWithFullData: INotification = {
  id: 14097,
  feature: 'synergies enterprise',
  subject: 'magenta',
  content: 'Incredible',
  receivedDate: dayjs('2023-03-21T19:43'),
  status: true,
  read: true,
};

export const sampleWithNewData: NewNotification = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
