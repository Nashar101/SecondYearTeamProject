import { IUser } from 'app/entities/user/user.model';

export interface IExtensionID {
  id: number;
  extensionID?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewExtensionID = Omit<IExtensionID, 'id'> & { id: null };
