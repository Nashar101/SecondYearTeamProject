import dayjs from 'dayjs/esm';

import { IAntiProcrastinationList, NewAntiProcrastinationList } from './anti-procrastination-list.model';

export const sampleWithRequiredData: IAntiProcrastinationList = {
  id: 53537,
};

export const sampleWithPartialData: IAntiProcrastinationList = {
  id: 78255,
  link: 'Metal Incredible',
  days: 14873,
  hours: 72437,
  seconds: 91905,
  empty: 'Communications Metal Sudanese',
  idk: 'enable Loan connecting',
  idk1: 'Analyst',
};

export const sampleWithFullData: IAntiProcrastinationList = {
  id: 34933,
  link: 'Dynamic withdrawal orange',
  type: 'Inverse invoice Market',
  days: 75919,
  hours: 64816,
  minutes: 6231,
  seconds: 50897,
  empty: 'convergence',
  idk: 'background deposit Clothing',
  idk1: 'Dalasi',
  dueDate: dayjs('2023-03-19T15:34'),
};

export const sampleWithNewData: NewAntiProcrastinationList = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
