import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface ITodolistItem {
  id: number;
  heading?: string | null;
  description?: string | null;
  creationTime?: dayjs.Dayjs | null;
  lastEditTime?: dayjs.Dayjs | null;
  completed?: boolean | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewTodolistItem = Omit<ITodolistItem, 'id'> & { id: null };
