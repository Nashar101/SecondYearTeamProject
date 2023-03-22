import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface INotification {
  id: number;
  feature?: string | null;
  subject?: string | null;
  content?: string | null;
  receivedDate?: dayjs.Dayjs | null;
  status?: boolean | null;
  read?: boolean | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewNotification = Omit<INotification, 'id'> & { id: null };
