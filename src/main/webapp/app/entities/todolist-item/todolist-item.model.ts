import dayjs from 'dayjs/esm';

export interface ITodolistItem {
  id: number;
  heading?: string | null;
  description?: string | null;
  creationTime?: dayjs.Dayjs | null;
  lastEditTime?: dayjs.Dayjs | null;
  completed?: boolean | null;
}

export type NewTodolistItem = Omit<ITodolistItem, 'id'> & { id: null };
