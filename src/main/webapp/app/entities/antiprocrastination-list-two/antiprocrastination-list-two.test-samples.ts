import dayjs from 'dayjs/esm';

import { IAntiprocrastinationListTwo, NewAntiprocrastinationListTwo } from './antiprocrastination-list-two.model';

export const sampleWithRequiredData: IAntiprocrastinationListTwo = {
  id: 44038,
};

export const sampleWithPartialData: IAntiprocrastinationListTwo = {
  id: 73594,
  days: 12684,
  hours: 42522,
  empty: 'client-server end-to-end Cambridgeshire',
  idk1: 'magenta framework back-end',
  dueDate: dayjs('2023-04-17T03:21'),
};

export const sampleWithFullData: IAntiprocrastinationListTwo = {
  id: 76912,
  link: 'COM',
  type: 'De-engineered',
  days: 69033,
  hours: 98477,
  minutes: 59293,
  seconds: 58910,
  empty: 'mobile Moldova',
  idk: 'Account Home',
  idk1: 'Wooden',
  dueDate: dayjs('2023-04-18T00:02'),
};

export const sampleWithNewData: NewAntiprocrastinationListTwo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
