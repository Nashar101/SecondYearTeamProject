import { IUser } from 'app/entities/user/user.model';

export interface IAlarm {
  id: number;
  alarmName?: string | null;
  type?: string | null;
  hours?: number | null;
  minutes?: number | null;
  seconds?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewAlarm = Omit<IAlarm, 'id'> & { id: null };
