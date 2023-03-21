import dayjs from 'dayjs/esm';

export interface IAntiProcrastinationList {
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
}

export type NewAntiProcrastinationList = Omit<IAntiProcrastinationList, 'id'> & { id: null };
