import dayjs from 'dayjs/esm';

import { IToDoItem, NewToDoItem } from './to-do-item.model';

export const sampleWithRequiredData: IToDoItem = {
  id: 40844,
  toDoItemHeading: 'Buckinghamshire programming',
  toDoItemStatus: dayjs('2023-03-21T07:35'),
};

export const sampleWithPartialData: IToDoItem = {
  id: 86095,
  toDoItemHeading: 'Gold Wooden foreground',
  toDoItemStatus: dayjs('2023-03-21T12:49'),
};

export const sampleWithFullData: IToDoItem = {
  id: 17955,
  toDoItemHeading: 'yellow Orchestrator Bike',
  toDoItemDescription: 'synthesize Avon Account',
  toDoItemStatus: dayjs('2023-03-21T03:33'),
};

export const sampleWithNewData: NewToDoItem = {
  toDoItemHeading: 'maroon parsing Pizza',
  toDoItemStatus: dayjs('2023-03-21T05:12'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
