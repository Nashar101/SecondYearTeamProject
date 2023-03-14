export interface ITesting {
  id: number;
  suwi?: string | null;
}

export type NewTesting = Omit<ITesting, 'id'> & { id: null };
