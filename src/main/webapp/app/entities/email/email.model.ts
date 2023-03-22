import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IEmail {
  id: number;
  subject?: string | null;
  content?: string | null;
  receivedDate?: dayjs.Dayjs | null;
  deadline?: dayjs.Dayjs | null;
  status?: string | null;
  recipient?: string | null;
  read?: boolean | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewEmail = Omit<IEmail, 'id'> & { id: null };
