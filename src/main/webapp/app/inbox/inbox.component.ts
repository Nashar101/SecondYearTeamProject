import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { EmailService } from '../entities/email/service/email.service';
import { IEmail, NewEmail } from '../entities/email/email.model';
import { TodolistItemService } from '../entities/todolist-item/service/todolist-item.service';
import { UserService } from '../entities/user/user.service';
import { AccountService } from '../core/auth/account.service';
import { HttpClient } from '@angular/common/http';

export class Email {
  date!: string;
  sender!: string;
  subject!: string;
  selected!: boolean;
  content!: string;
  id!: number;
}

@Component({
  selector: 'jhi-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  constructor(private email: EmailService, private http: HttpClient) {}
  private readonly emailSubject = new BehaviorSubject<Email[]>([]);
  emails$: Observable<Email[]> = this.emailSubject.asObservable();

  sortType$ = new BehaviorSubject<string>('date');

  private _emails: Email[] = [];

  selectedEmail: Email | null = null;

  get emails(): Email[] {
    return this._emails;
  }

  set emails(emails: Email[]) {
    this._emails = emails;
    this.emailSubject.next(emails);
  }

  listItems?: IEmail[];
  Init(): void {
    this.http.get<any>('/api/account').subscribe(account => {
      const userID = account.id;
      console.log(userID);
      this.email.query().subscribe(response => {
        const items = response.body || [];
        this.listItems = items;
        this.listItems = this.listItems.filter(list => list.user?.id === userID);
        for (let i = 0; i < this.listItems.length; i++) {
          let add = new Email();
          add.id = this.listItems[i].id;
          //@ts-ignore
          add.subject = this.listItems[i].subject;
          //@ts-ignore
          add.sender = this.listItems[i].recipient;
          //@ts-ignore
          add.selected = this.listItems[i].read;
          //@ts-ignore
          add.date = this.listItems[i].receivedDate;
          //@ts-ignore
          add.content = this.listItems[i].content;
          this.emails.push(add);
        }
      });
    });
  }

  ngOnInit(): void {
    this.Init();
  }

  sortEmails(sortType: string): void {
    switch (sortType) {
      case 'date':
        this.emails = [...this.emails].sort((a: Email, b: Email) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'sender':
        this.emails = [...this.emails].sort((a: Email, b: Email) => a.sender.localeCompare(b.sender));
        break;
      case 'subject':
        this.emails = [...this.emails].sort((a: Email, b: Email) => a.subject.localeCompare(b.subject));
        break;
    }
    this.sortType$.next(sortType);
  }

  deleteEmail(email: Email) {
    const index = this.emails.indexOf(email);
    if (index !== -1) {
      this.emails.splice(index, 1);
      this.emails = [...this.emails];
    }
    this.email.delete(email.id).subscribe();
  }

  deleteSelected() {
    this.emails = this.emails.filter(email => !email.selected);
  }

  showDetails(email: Email) {
    this.selectedEmail = email;
  }

  closeDetails() {
    this.selectedEmail = null;
  }
}
