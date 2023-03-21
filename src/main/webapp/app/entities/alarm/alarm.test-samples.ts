import { IAlarm, NewAlarm } from './alarm.model';

export const sampleWithRequiredData: IAlarm = {
  id: 84160,
};

export const sampleWithPartialData: IAlarm = {
  id: 28092,
  seconds: 55641,
};

export const sampleWithFullData: IAlarm = {
  id: 69626,
  alarmName: 'Sausages Tasty Bike',
  type: 'non-volatile Analyst',
  hours: 83436,
  minutes: 76758,
  seconds: 79520,
};

export const sampleWithNewData: NewAlarm = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
