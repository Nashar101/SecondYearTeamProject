import { IUser } from 'app/entities/user/user.model';
import { NewAntiprocrastinationListTwo } from '../antiprocrastination-list-two/antiprocrastination-list-two.model';
import dayjs from 'dayjs';

export interface IHistoryTwo {
  id: number;
  subject?: string | null;
  subjectScore?: number | null;
  subjectTarget?: number | null;
  upcomingTest?: string | null;
  upcomingTestTarget?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewHistoryTwo = Omit<IHistoryTwo, 'id'> & { id: null };

/**const newItem: NewAntiprocrastinationListTwo = {
  link: link,
  days: day,
  type: type,
  hours: hours,
  minutes: minutes,
  seconds: seconds,
  idk: idk,
  idk1: idk1,
  empty: empty,
  //@ts-ignore
  dueDate: dayjs(dueDate),
  user: { id: userId, login: account.login },
};**/

/** this.accountService.identity().subscribe(account => {
      if (account) {
        console.log(account.login);
        this.http.get<any>('/api/account').subscribe(account => {
          const userId = account.id;
          const newItem: NewHistoryTwo = {
            subject: this.newSubject,
            subjectScore:  this.score,
            subjectTarget: 0,
            upcomingTest: "",
            upcomingTestTarget : 0,
            user: { id: userId, login: account.login },
          };
          this.antiProcrastinationListService2.create(newItem).subscribe();
          this.newList.subject.push(this.newSubject)
          this.newList.subjectScore.push(this.score)
          this.newSubject = "";
          this.score = 0;

          this.myChart.destroy();
          this.init();
        });
      }
    }); **/
