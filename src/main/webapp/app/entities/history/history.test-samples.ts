import { IHistory, NewHistory } from './history.model';

export const sampleWithRequiredData: IHistory = {
  id: 42912,
};

export const sampleWithPartialData: IHistory = {
  id: 85266,
  subject: 'Chips Plastic',
  upcomingTestTarget: 7149,
};

export const sampleWithFullData: IHistory = {
  id: 10657,
  subject: 'Planner Bacon',
  subjectScore: 4546,
  subjectTarget: 11099,
  upcomingTest: 'ubiquitous Crossing Supervisor',
  upcomingTestTarget: 14896,
};

export const sampleWithNewData: NewHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
