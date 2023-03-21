import { IUser } from 'app/entities/user/user.model';

export interface IHistory {
  id: number;
  subject?: string | null;
  subjectScore?: number | null;
  subjectTarget?: number | null;
  upcomingTest?: string | null;
  upcomingTestTarget?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewHistory = Omit<IHistory, 'id'> & { id: null };
