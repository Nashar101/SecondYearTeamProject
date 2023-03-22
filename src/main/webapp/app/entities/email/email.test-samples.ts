import dayjs from 'dayjs/esm';

import { IEmail, NewEmail } from './email.model';

export const sampleWithRequiredData: IEmail = {
  id: 42618,
};

export const sampleWithPartialData: IEmail = {
  id: 69196,
  subject: 'quantifying Port Ameliorated',
  content: 'Checking ADP invoice',
  status: 'Home India',
  read: false,
};

export const sampleWithFullData: IEmail = {
  id: 11673,
  subject: 'Borders Investor',
  content: 'protocol International',
  receivedDate: dayjs('2023-03-21T12:02'),
  deadline: dayjs('2023-03-22T06:23'),
  status: 'Fields panel Games',
  recipient: 'Ergonomic e-tailers Dynamic',
  read: true,
};

export const sampleWithNewData: NewEmail = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
