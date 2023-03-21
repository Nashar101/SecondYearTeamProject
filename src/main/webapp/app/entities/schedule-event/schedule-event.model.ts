import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IScheduleEvent {
  id: number;
  startTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  heading?: string | null;
  date?: dayjs.Dayjs | null;
  details?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewScheduleEvent = Omit<IScheduleEvent, 'id'> & { id: null };
