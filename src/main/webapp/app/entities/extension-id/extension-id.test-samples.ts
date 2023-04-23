import { IExtensionID, NewExtensionID } from './extension-id.model';

export const sampleWithRequiredData: IExtensionID = {
  id: 27203,
};

export const sampleWithPartialData: IExtensionID = {
  id: 12623,
  extensionID: 'Group Mobility',
};

export const sampleWithFullData: IExtensionID = {
  id: 917,
  extensionID: 'payment compressing synthesizing',
};

export const sampleWithNewData: NewExtensionID = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
