import { IAntiProcrastination, NewAntiProcrastination } from './anti-procrastination.model';

export const sampleWithRequiredData: IAntiProcrastination = {
  id: 93851,
  url: 'http://dandre.info',
  type: true,
  days: 59395,
  hours: 70530,
  minutes: 91671,
  seconds: 4582,
};

export const sampleWithPartialData: IAntiProcrastination = {
  id: 10581,
  url: 'http://bret.name',
  type: true,
  days: 81043,
  hours: 94420,
  minutes: 93587,
  seconds: 66076,
};

export const sampleWithFullData: IAntiProcrastination = {
  id: 46098,
  url: 'https://eliseo.com',
  type: false,
  days: 18918,
  hours: 47225,
  minutes: 40464,
  seconds: 91847,
};

export const sampleWithNewData: NewAntiProcrastination = {
  url: 'http://sammie.info',
  type: true,
  days: 15380,
  hours: 82374,
  minutes: 74,
  seconds: 62354,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
