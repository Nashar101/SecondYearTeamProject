import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IAntiprocrastinationListTwo {
  id: number;
  link?: string | null;
  type?: string | null;
  days?: number | null;
  hours?: number | null;
  minutes?: number | null;
  seconds?: number | null;
  empty?: string | null;
  idk?: string | null;
  idk1?: string | null;
  dueDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewAntiprocrastinationListTwo = Omit<IAntiprocrastinationListTwo, 'id'> & { id: null };
