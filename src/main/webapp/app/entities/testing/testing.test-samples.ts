import { ITesting, NewTesting } from './testing.model';

export const sampleWithRequiredData: ITesting = {
  id: 83525,
  suwi: 'Street Money Internal',
};

export const sampleWithPartialData: ITesting = {
  id: 51818,
  suwi: 'Cambridgeshire local open-source',
};

export const sampleWithFullData: ITesting = {
  id: 97178,
  suwi: 'Security Peso',
};

export const sampleWithNewData: NewTesting = {
  suwi: 'Representative white',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
