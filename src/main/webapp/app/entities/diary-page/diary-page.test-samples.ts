import dayjs from 'dayjs/esm';

import { IDiaryPage, NewDiaryPage } from './diary-page.model';

export const sampleWithRequiredData: IDiaryPage = {
  id: 492,
  pageDate: dayjs('2023-03-20T20:19'),
  creationTime: dayjs('2023-03-21T01:22'),
  lastEditTime: dayjs('2023-03-21T00:44'),
};

export const sampleWithPartialData: IDiaryPage = {
  id: 19914,
  pageDate: dayjs('2023-03-21T06:47'),
  pageDescription: 'Automated Incredible',
  creationTime: dayjs('2023-03-21T17:47'),
  lastEditTime: dayjs('2023-03-20T21:43'),
};

export const sampleWithFullData: IDiaryPage = {
  id: 72053,
  pageDate: dayjs('2023-03-20T23:15'),
  pageDescription: 'lime web-readiness',
  creationTime: dayjs('2023-03-21T06:44'),
  lastEditTime: dayjs('2023-03-21T01:37'),
};

export const sampleWithNewData: NewDiaryPage = {
  pageDate: dayjs('2023-03-21T02:28'),
  creationTime: dayjs('2023-03-20T18:27'),
  lastEditTime: dayjs('2023-03-20T21:17'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
