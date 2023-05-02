import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ITodolistItem } from '../entities/todolist-item/todolist-item.model';

interface Email {
  date: string;
  sender: string;
  subject: string;
  selected: boolean;
}

@Component({
  selector: 'jhi-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
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

  ngOnInit(): void {
    this.emails = [
      { date: 'April 26, 2023', sender: 'antiprocrastapp@gmail.com', subject: 'Task Completed', selected: false },
      { date: 'March 14, 2023', sender: 'antiprocrastapp@gmail.com', subject: 'New URL blocked', selected: false },
      { date: 'April 12, 2023', sender: 'antiprocrastapp@gmail.com', subject: 'Task Completed', selected: false },
      { date: 'April 8, 2023', sender: 'antiprocrastapp@gmail.com', subject: 'New URL blocked', selected: false },
      { date: 'April 19, 2023', sender: 'antiprocrastapp@gmail.com', subject: 'Task Completed', selected: false },
    ];
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
