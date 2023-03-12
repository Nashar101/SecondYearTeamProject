import dayjs from 'dayjs/esm';

import { ITodolistItem, NewTodolistItem } from './todolist-item.model';

export const sampleWithRequiredData: ITodolistItem = {
  id: 16288,
  heading: 'best-of-breed',
  description: 'supply-chains online',
  creationTime: dayjs('2023-03-06T13:25'),
  lastEditTime: dayjs('2023-03-06T08:37'),
  completed: false,
};

export const sampleWithPartialData: ITodolistItem = {
  id: 40242,
  heading: 'incubate Gorgeous support',
  description: 'Communications capacity',
  creationTime: dayjs('2023-03-06T03:58'),
  lastEditTime: dayjs('2023-03-06T14:06'),
  completed: false,
};

export const sampleWithFullData: ITodolistItem = {
  id: 86645,
  heading: 'Handcrafted copy Tasty',
  description: 'supply-chains',
  creationTime: dayjs('2023-03-05T20:49'),
  lastEditTime: dayjs('2023-03-06T16:19'),
  completed: true,
};

export const sampleWithNewData: NewTodolistItem = {
  heading: 'indexing',
  description: 'Springs Handcrafted Rubber',
  creationTime: dayjs('2023-03-06T08:37'),
  lastEditTime: dayjs('2023-03-05T23:13'),
  completed: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
