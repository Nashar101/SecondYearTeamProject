export interface IAntiProcrastination {
  id: number;
  url?: string | null;
  type?: boolean | null;
  days?: number | null;
  hours?: number | null;
  minutes?: number | null;
  seconds?: number | null;
}

export type NewAntiProcrastination = Omit<IAntiProcrastination, 'id'> & { id: null };
