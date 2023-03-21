import dayjs from 'dayjs/esm';
import { IDiaryPage } from 'app/entities/diary-page/diary-page.model';

export interface IToDoItem {
  id: number;
  toDoItemHeading?: string | null;
  toDoItemDescription?: string | null;
  toDoItemStatus?: dayjs.Dayjs | null;
  diaryPage?: Pick<IDiaryPage, 'id' | 'pageDate'> | null;
}

export type NewToDoItem = Omit<IToDoItem, 'id'> & { id: null };
