import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IDiaryPage {
  id: number;
  pageDate?: dayjs.Dayjs | null;
  pageDescription?: string | null;
  creationTime?: dayjs.Dayjs | null;
  lastEditTime?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewDiaryPage = Omit<IDiaryPage, 'id'> & { id: null };
