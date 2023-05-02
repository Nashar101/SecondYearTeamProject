import { IHistoryTwo, NewHistoryTwo } from './history-two.model';

export const sampleWithRequiredData: IHistoryTwo = {
  id: 78062,
};

export const sampleWithPartialData: IHistoryTwo = {
  id: 39304,
  subject: 'generate initiatives payment',
  subjectScore: 1642,
  upcomingTest: 'reboot Cheese Fords',
  upcomingTestTarget: 91599,
};

export const sampleWithFullData: IHistoryTwo = {
  id: 5407,
  subject: 'bandwidth-monitored implement',
  subjectScore: 81524,
  subjectTarget: 83083,
  upcomingTest: 'generate Corporate',
  upcomingTestTarget: 91099,
};

export const sampleWithNewData: NewHistoryTwo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
